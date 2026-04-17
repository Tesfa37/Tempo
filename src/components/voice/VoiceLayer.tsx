"use client";

import { useState } from "react";
import { VoiceSearchButton } from "./VoiceSearchButton";
import { VoiceCommandHelp } from "./VoiceCommandHelp";

export function VoiceLayer() {
  const [helpOpen, setHelpOpen] = useState(false);

  return (
    <>
      <VoiceSearchButton onOpenHelp={() => setHelpOpen(true)} />
      <VoiceCommandHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
