"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PostCard from "@/components/post-card";
import { useDemoStore } from "@/lib/demo-store";

export default function GroupsPage() {
  const { posts, books } = useDemoStore();
  const [bookId, setBookId] = useState("all");
  const filtered = useMemo(
    () => posts.filter((post) => bookId === "all" || post.bookId === bookId).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [posts, bookId],
  );

  return (
    <main className="content-page groups-page">
      <section className="page-intro">
        <span className="eyebrow light-eyebrow">Readers, gathered</span>
        <h1>Pull up a <span>chair.</span></h1>
        <p>Book chats, thoughtful recommendations, and the occasional happy ending.</p>
      </section>
      <div className="feed-toolbar">
        <label className="genre-filter">
          <span className="sr-only">Filter conversations by book</span>
          <select onChange={(event) => setBookId(event.target.value)} value={bookId}>
            <option value="all">All conversations</option>
            {books.map((book) => <option key={book.id} value={book.id}>{book.title}</option>)}
          </select>
        </label>
        <Link className="button button-green" href="/posts/new">＋ Start a discussion</Link>
      </div>
      {filtered.length ? (
        <div className="post-list">{filtered.map((post) => <PostCard key={post.id} post={post} />)}</div>
      ) : (
        <div className="empty-state glass-panel"><span>✿</span><h2>A quiet reading room</h2><p>No discussions yet for this book. Start one and bring readers together.</p></div>
      )}
    </main>
  );
}
