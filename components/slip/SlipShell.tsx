"use client";

import { SlipSheet } from "@/components/slip/SlipSheet";
import { SlipPreviewBar } from "@/components/slip/SlipPreviewBar";

type Props = {
  hideFabOnHome?: boolean;
};

export function SlipShell(_props: Props) {
  return (
    <>
      <SlipPreviewBar />
      <SlipSheet />
    </>
  );
}
