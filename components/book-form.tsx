"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, type FormEvent } from "react";
import { bookGenres, useDemoStore } from "@/lib/demo-store";

export default function BookForm({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const { edit: editId } = use(searchParams);
  const router = useRouter();
  const { books, currentUser, ready, saveBook } = useDemoStore();
  const book = books.find((item) => item.id === editId);
  const [title, setTitle] = useState<string>();
  const [author, setAuthor] = useState<string>();
  const [genre, setGenre] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [coverImageUrl, setCoverImageUrl] = useState<string>();
  const [error, setError] = useState("");
  const titleValue = title ?? book?.title ?? "";
  const authorValue = author ?? book?.author ?? "";
  const genreValue = genre ?? book?.genre ?? bookGenres[0];
  const descriptionValue = description ?? book?.description ?? "";
  const coverValue = coverImageUrl ?? book?.coverImageUrl ?? "";

  if (!ready) return <main className="content-page"><div className="empty-state glass-panel">Opening your book form…</div></main>;
  if (!currentUser) return <main className="content-page"><div className="empty-state glass-panel"><h2>Sign in to add a book.</h2><Link className="button button-green" href="/login">Log in</Link></div></main>;
  if (editId && book?.addedByUserId !== currentUser.id) {
    return <main className="content-page"><div className="empty-state glass-panel"><h2>You can only edit books you added.</h2><Link href="/books">Back to books</Link></div></main>;
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    try {
      if (!titleValue.trim() || !authorValue.trim() || !descriptionValue.trim()) {
        setError("Please provide a title, author, and description.");
        return;
      }
      saveBook({
        title: titleValue.trim(),
        author: authorValue.trim(),
        genre: genreValue,
        description: descriptionValue.trim(),
        coverImageUrl: coverValue.trim() || "/images/books/holy-bible.jpg",
      }, editId);
      router.push("/profile");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not save this book.");
    }
  }

  return (
    <main className="content-page form-page">
      <div className="page-intro"><span className="eyebrow light-eyebrow">Add to the shelves</span><h1>{editId ? "Edit a book" : "Add a new book"}</h1><p>Share a story with fellow readers.</p></div>
      <form className="composer-card data-form" onSubmit={submit}>
        <div className="form-field"><label htmlFor="book-title">Title</label><input id="book-title" onChange={(event) => setTitle(event.target.value)} required value={titleValue} /></div>
        <div className="form-field"><label htmlFor="book-author">Author</label><input id="book-author" onChange={(event) => setAuthor(event.target.value)} required value={authorValue} /></div>
        <div className="form-field"><label htmlFor="book-genre">Genre</label><select id="book-genre" onChange={(event) => setGenre(event.target.value)} value={genreValue}>{bookGenres.map((item) => <option key={item}>{item}</option>)}</select></div>
        <div className="form-field"><label htmlFor="book-cover">Cover image URL <span>(optional)</span></label><input id="book-cover" onChange={(event) => setCoverImageUrl(event.target.value)} placeholder="/images/books/..." value={coverValue} /></div>
        <div className="form-field"><label htmlFor="book-description">Description</label><textarea id="book-description" onChange={(event) => setDescription(event.target.value)} required rows={5} value={descriptionValue} /></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><Link className="button button-quiet" href="/profile">Cancel</Link><button className="button button-green" type="submit">{editId ? "Save changes" : "Add book"}</button></div>
      </form>
    </main>
  );
}
