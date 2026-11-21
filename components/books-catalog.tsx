"use client";

import { useMemo, use, useState } from "react";
import BookCard from "@/components/book-card";
import { useDemoStore } from "@/lib/demo-store";

export default function BooksCatalog({ searchParams }: { searchParams: Promise<{ genre?: string }> }) {
  const { genre: initialGenre = "All genres" } = use(searchParams);
  const { books } = useDemoStore();
  const [query, setQuery] = useState("");
  const [genre, setGenre] = useState(initialGenre);
  const genres = ["All genres", ...new Set(books.map((book) => book.genre))];
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return books.filter((book) => {
      const matchesText = !needle || [book.title, book.author, book.genre].some((value) => value.toLowerCase().includes(needle));
      return matchesText && (genre === "All genres" || book.genre.toLowerCase() === genre.toLowerCase());
    });
  }, [books, query, genre]);

  return (
    <main className="content-page books-page">
      <section className="page-intro">
        <span className="eyebrow light-eyebrow">The collection</span>
        <h1>Find your next <span>favorite.</span></h1>
        <p>Browse the shelves and follow the stories that call to you.</p>
      </section>
      <div className="book-controls">
        <label className="search-field">
          <span aria-hidden="true">⌕</span>
          <input onChange={(event) => setQuery(event.target.value)} placeholder="Search for a book..." value={query} />
        </label>
        <label className="genre-filter">
          <span className="sr-only">Filter by genre</span>
          <select onChange={(event) => setGenre(event.target.value)} value={genre}>
            {genres.map((item) => <option key={item}>{item}</option>)}
          </select>
        </label>
      </div>
      <div className="results-caption">{filtered.length} {filtered.length === 1 ? "book" : "books"} on the shelf</div>
      {filtered.length ? (
        <div className="catalog-grid">{filtered.map((book, index) => <BookCard book={book} key={book.id} priority={index < 4} />)}</div>
      ) : (
        <div className="empty-state glass-panel"><span>✿</span><h2>No books found just yet</h2><p>Try another title or genre, or add a new book to the shelf.</p></div>
      )}
    </main>
  );
}
