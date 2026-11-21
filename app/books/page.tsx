import { Suspense } from "react";
import BooksCatalog from "@/components/books-catalog";

export default function BooksPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string }>;
}) {
  return <Suspense fallback={<main className="content-page"><div className="empty-state glass-panel">Opening the book collection…</div></main>}><BooksCatalog searchParams={searchParams} /></Suspense>;
}
