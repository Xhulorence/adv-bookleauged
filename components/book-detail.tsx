"use client";

import Image from "next/image";
import Link from "next/link";
import { use } from "react";
import PostCard from "@/components/post-card";
import { useDemoStore } from "@/lib/demo-store";

export default function BookDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { books, posts } = useDemoStore();
  const book = books.find((item) => item.id === id);
  if (!book) return <main className="content-page"><div className="empty-state glass-panel"><span>✿</span><h1>We can’t find that book.</h1><Link href="/books">Back to the books</Link></div></main>;
  const relatedPosts = posts.filter((post) => post.bookId === book.id);

  return (
    <main className="content-page detail-page">
      <Link className="back-link" href="/books"><span aria-hidden="true">←</span> Back to the collection</Link>
      <section className="book-detail-card glass-panel">
        <div className="detail-cover-wrap"><Image alt={`Cover of ${book.title}`} className="detail-cover" height={600} priority src={book.coverImageUrl || "/images/books/holy-bible.jpg"} unoptimized width={400} /></div>
        <div className="book-detail-copy">
          <span className="eyebrow">{book.genre}</span>
          <h1>{book.title}</h1>
          <p className="detail-author">by {book.author}</p>
          <p className="detail-description">{book.description}</p>
          <div className="detail-actions"><Link className="button button-green" href={`/posts/new?book=${book.id}`}>Discuss this book <span>↗</span></Link></div>
        </div>
      </section>
      <section className="detail-discussions">
        <div className="shelf-heading">
          <div><span className="eyebrow light-eyebrow">From the reading room</span><h2>Reader discussions</h2></div>
          <Link className="small-link" href={`/posts/new?book=${book.id}`}>Start a discussion <span>↗</span></Link>
        </div>
        {relatedPosts.length ? <div className="post-list">{relatedPosts.map((post) => <PostCard key={post.id} post={post} />)}</div> : <div className="empty-state glass-panel"><h2>Be the first to share a thought</h2><p>No one has started a conversation about this book yet.</p></div>}
      </section>
    </main>
  );
}
