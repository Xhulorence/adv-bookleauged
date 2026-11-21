"use client";

import type { ReactNode } from "react";
import { DemoStoreProvider } from "@/lib/demo-store";

export default function Providers({ children }: { children: ReactNode }) {
  return <DemoStoreProvider>{children}</DemoStoreProvider>;
}
