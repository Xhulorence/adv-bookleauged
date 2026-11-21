import { Suspense } from "react";
import PostForm from "@/components/post-form";

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ edit?: string; book?: string }>;
}) {
  return <Suspense fallback={<div className="content-page"><div className="empty-state glass-panel">Opening your post form…</div></div>}><PostForm searchParams={searchParams} /></Suspense>;
}
