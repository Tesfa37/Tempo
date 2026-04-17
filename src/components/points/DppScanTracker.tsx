"use client";

import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { awardPoints } from "@/app/actions/points";
import { queueGuestEvent } from "./GuestPointsTracker";
import { showEarnToast, showTierUpToast } from "./EarnToast";

interface DppScanTrackerProps {
  sku: string;
  productName: string;
}

export function DppScanTracker({ sku, productName }: DppScanTrackerProps) {
  const firedRef = useRef(false);

  useEffect(() => {
    if (firedRef.current) return;
    firedRef.current = true;

    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        queueGuestEvent("scan_dpp", 100, { sku });
        return;
      }

      const result = await awardPoints("scan_dpp", 100, { sku });
      if (result.success && !result.skipped) {
        showEarnToast(100, `Scanned ${productName} passport`);
        if (result.tierChanged && result.tier) {
          showTierUpToast(result.tier);
        }
      }
    })();
  }, [sku, productName]);

  return null;
}
