"use server";

import { createClient, createServiceClient } from "@/lib/supabase/server";
import { awardPoints } from "./points";
import Anthropic from "@anthropic-ai/sdk";

export type ConversationMessage = { role: "user" | "assistant"; content: string };

export async function saveConversation(
  messages: ConversationMessage[]
): Promise<
  | { success: true; conversationId: string; pointsAwarded: boolean }
  | { success: false; error: string }
> {
  if (!messages.length) return { success: false, error: "No messages to save" };

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const admin = createServiceClient();

  const { data, error } = await admin
    .from("fit_conversations")
    .insert({
      user_id: user?.id ?? null,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      messages: messages as any,
      share_enabled: false,
    })
    .select("id")
    .single();

  if (error || !data)
    return { success: false, error: error?.message ?? "Insert failed" };

  let pointsAwarded = false;
  if (user) {
    const result = await awardPoints("save_fit_conversation", 50);
    pointsAwarded = result.success && !result.skipped;
  }

  return { success: true, conversationId: data.id as string, pointsAwarded };
}

export async function generateShareSummary(
  conversationId: string
): Promise<{ success: true; shareUrl: string } | { success: false; error: string }> {
  const admin = createServiceClient();

  const { data: conv, error } = await admin
    .from("fit_conversations")
    .select("messages")
    .eq("id", conversationId)
    .single();

  if (error || !conv) return { success: false, error: "Conversation not found" };

  const messages = conv.messages as unknown as ConversationMessage[];
  const transcript = messages
    .map(
      (m) =>
        `${m.role === "user" ? "Customer" : "Fit Concierge"}: ${m.content}`
    )
    .join("\n\n");

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  let summary = "";
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 300,
      messages: [
        {
          role: "user",
          content: `Summarize this Tempo Fit Concierge consultation in 3-4 sentences for a caregiver or occupational therapist to review. Focus on the customer's specific needs and the products recommended. Be direct and clinical. Use identity-first language (e.g. "wheelchair user," not "person in a wheelchair").\n\n${transcript}`,
        },
      ],
    });
    const block = response.content[0];
    if (block?.type === "text") summary = block.text;
  } catch {
    return { success: false, error: "Summary generation failed" };
  }

  const { error: updateError } = await admin
    .from("fit_conversations")
    .update({ summary, share_enabled: true })
    .eq("id", conversationId);

  if (updateError) return { success: false, error: updateError.message };

  return { success: true, shareUrl: `/concierge/share/${conversationId}` };
}
