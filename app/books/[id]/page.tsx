import { Suspense } from "react";
import BookDetail from "@/components/book-detail";

export default function BookDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <Suspense fallback={<div className="content-page"><div className="empty-state glass-panel">Opening book details…</div></div>}><BookDetail params={params} /></Suspense>;
}
