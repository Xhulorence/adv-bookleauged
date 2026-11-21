"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, type FormEvent } from "react";
import { useDemoStore } from "@/lib/demo-store";

export default function PostForm({ searchParams }: { searchParams: Promise<{ edit?: string; book?: string }> }) {
  const { edit: editId, book: selectedBookId } = use(searchParams);
  const router = useRouter();
  const { books, currentUser, posts, ready, savePost } = useDemoStore();
  const post = posts.find((item) => item.id === editId);
  const [title, setTitle] = useState<string>();
  const [bookId, setBookId] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const [readingUrl, setReadingUrl] = useState<string>();
  const [error, setError] = useState("");
  const titleValue = title ?? post?.title ?? "";
  const bookValue = bookId ?? post?.bookId ?? selectedBookId ?? "";
  const descriptionValue = description ?? post?.description ?? "";
  const selectedBook = books.find((book) => book.id === bookValue);
  const coverValue = coverImageUrl ?? post?.coverImageUrl ?? selectedBook?.coverImageUrl ?? "";
  const readingValue = readingUrl ?? post?.readingUrl ?? "";

  if (!ready) return <main className="content-page"><div className="empty-state glass-panel">Opening your post form…</div></main>;
  if (!currentUser) return <main className="content-page"><div className="empty-state glass-panel"><h2>Sign in to join the conversation.</h2><Link className="button button-green" href="/login">Log in</Link></div></main>;
  if (editId && !post) return <main className="content-page"><div className="empty-state glass-panel"><h2>We couldn’t find that post.</h2><Link href="/groups">Back to discussions</Link></div></main>;
  if (post && post.authorUserId !== currentUser.id) {
    return <main className="content-page"><div className="empty-state glass-panel"><h2>You can only edit your own posts.</h2><Link href="/groups">Back to discussions</Link></div></main>;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      if (!titleValue.trim() || !descriptionValue.trim()) {
        setError("Please add both a title and some discussion text.");
        return;
      }
      const postId = savePost({
        title: titleValue.trim(),
        description: descriptionValue.trim(),
        bookId: bookValue || undefined,
        coverImageUrl: coverValue.trim() || undefined,
        readingUrl: readingValue.trim() || undefined,
      }, editId);
      router.push(`/posts/${postId}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save your post.");
    }
  }

  return (
    <main className="create-page">
      <section className="compose-intro">
        <Link className="back-link" href="/groups"><span aria-hidden="true">←</span> Back to conversations</Link>
        <span className="eyebrow light-eyebrow">Pass the good story along</span>
        <h1>Every great read deserves a <span>conversation.</span></h1>
        <p>Tell our little community what stayed with you, what surprised you, or who you think should read it next.</p>
        <div className="intro-quote">“A book is a dream that you hold in your hand.”<span>— Neil Gaiman</span></div>
      </section>
      <section className="composer-card" aria-labelledby="composer-title">
        <div className="composer-topline">
          <div><span className="eyebrow">Your reading note</span><h2 id="composer-title">{editId ? "Edit your post" : "Start a discussion"}</h2></div>
          <span className="draft-label">✦ Community post</span>
        </div>
        <form onSubmit={submit}>
          <div className="form-field">
            <label htmlFor="post-title">Post title</label>
            <input id="post-title" maxLength={100} onChange={(event) => setTitle(event.target.value)} placeholder="A title that makes readers curious..." required value={titleValue} />
          </div>
          <div className="form-field">
            <label htmlFor="selected-book">Book <span>(optional)</span></label>
            <select
              id="selected-book"
              onChange={(event) => {
                const nextBookId = event.target.value;
                setBookId(nextBookId);
                setCoverImageUrl(undefined);
                const nextBook = books.find((book) => book.id === nextBookId);
                if (nextBook) setCoverImageUrl(nextBook.coverImageUrl);
              }}
              value={bookValue}
            >
              <option value="">A general reading-room discussion</option>
              {books.map((book) => <option key={book.id} value={book.id}>{book.title} — {book.author}</option>)}
            </select>
          </div>
          <div className="post-image-fields">
            <div className="form-field">
              <label htmlFor="post-cover">Book cover image <span>(optional)</span></label>
              <input
                id="post-cover"
                onChange={(event) => setCoverImageUrl(event.target.value)}
                placeholder="/images/books/..."
                value={coverValue}
              />
              <p className="field-hint">Use an uploaded cover path or a public image URL.</p>
            </div>
            <div className="form-field">
              <label htmlFor="reading-url">Where to read <span>(optional)</span></label>
              <input
                id="reading-url"
                onChange={(event) => setReadingUrl(event.target.value)}
                placeholder="https://example.com/book"
                type="url"
                value={readingValue}
              />
              <p className="field-hint">Add a link to an official page, ebook, or library.</p>
            </div>
          </div>
          <div className="form-field">
            <label htmlFor="post-content">Your recommendation or discussion</label>
            <textarea id="post-content" maxLength={4000} onChange={(event) => setDescription(event.target.value)} placeholder="What did you love about this book? Who would you recommend it to? Start the conversation..." required rows={8} value={descriptionValue} />
            <div className="textarea-footer"><span>Be kind, and remember spoiler warnings.</span><span>{descriptionValue.length}/4000</span></div>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <div className="composer-footer">
            <div className="privacy-note"><span aria-hidden="true">✦</span><span>Saved in this browser’s demo reading room</span></div>
            <button className="button button-green publish-button" type="submit">{editId ? "Save changes" : "Publish post"} <span aria-hidden="true">↗</span></button>
          </div>
        </form>
      </section>
    </main>
  );
}
