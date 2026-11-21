import { Suspense } from "react";
import BookForm from "@/components/book-form";

export default function NewBookPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string }>;
}) {
  return <Suspense fallback={<div className="content-page"><div className="empty-state glass-panel">Opening your book form…</div></div>}><BookForm searchParams={searchParams} /></Suspense>;
}
