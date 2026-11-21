import { Suspense } from "react";
import PostDetail from "@/components/post-detail";

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <Suspense fallback={<div className="content-page"><div className="empty-state glass-panel">Opening discussion…</div></div>}><PostDetail params={params} /></Suspense>;
}
