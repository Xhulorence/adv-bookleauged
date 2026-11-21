"use client";

import Image from "next/image";
import Link from "next/link";
import BookCard from "@/components/book-card";
import PostCard from "@/components/post-card";
import { useDemoStore } from "@/lib/demo-store";

const genres = [
  "Romance",
  "Mystery",
  "Science Fiction",
  "Fantasy",
  "Historical Fiction",
  "Thriller",
  "Horror",
  "Young Adult",
  "Manga & Anime",
  "Light Novels",
  "Comics",
  "Poetry",
];

const readingHistory = [
  {
    title: "Broken Rival",
    author: "Tessa Bailey",
    cover: "/images/books/broken-rival.jpg",
  },
  {
    title: "Trust",
    author: "Hernan Diaz",
    cover: "/images/books/trust.jpg",
  },
  {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    cover: "/images/books/sherlock-holmes.jpg",
  },
  {
    title: "Doctor Doom",
    author: "Marvel",
    cover: "/images/books/doctor-doom.jpg",
  },
  {
    title: "Trad Wife",
    author: "Sarah Langan",
    cover: "/images/books/trad-wife.jpg",
  },
];

export default function Home() {
  const { books, posts, currentUser } = useDemoStore();
  const featuredBooks = books.slice(0, 6);

  return (
    <main className="library-page">
      <aside className="genre-panel glass-panel">
        <div className="panel-heading">
          <span className="eyebrow">A little inspiration</span>
          <h2>Top Book Recommendations</h2>
        </div>
        <div className="genre-list">
          {genres.map((genre, index) => {
            const count = books.filter((book) => book.genre.toLowerCase() === genre.toLowerCase()).length;
            return (
              <Link className="genre-link" href={`/books?genre=${encodeURIComponent(genre)}`} key={genre}>
                <span className="genre-index">0{index + 1}</span>
                <span>{genre}</span>
                <span className="genre-count">{count || "—"}</span>
              </Link>
            );
          })}
        </div>
        <div className="sidebar-note">
          <span className="note-icon" aria-hidden="true">✳</span>
          <p>Good books are even better when they’re shared.</p>
        </div>
      </aside>

      <section className="discovery">
        <div className="welcome-copy">
          <span className="eyebrow light-eyebrow">Your next chapter starts here</span>
          <h1>Find a Book that<br /><span>you want to Read</span></h1>
          <p>Meet your next favorite read, and the readers who love it too.</p>
          <Link className="text-link" href={currentUser ? "/posts/new" : "/signup"}>
            Share a recommendation <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="shelf-heading">
          <div>
            <span className="eyebrow light-eyebrow">Picked for curious readers</span>
            <h2>Books to wander into</h2>
          </div>
          <Link href="/books" className="small-link">Explore all books <span aria-hidden="true">↗</span></Link>
        </div>
        <div className="book-shelf" aria-label="Featured books">
          {featuredBooks.map((book, index) => <BookCard book={book} key={book.id} priority={index < 3} />)}
        </div>

        <section className="community-callout glass-panel">
          <div className="callout-mark" aria-hidden="true">✳</div>
          <div>
            <span className="eyebrow">The reading room</span>
            <h2>Every reader has a story to share.</h2>
            <p>Start a conversation about the book you can’t stop thinking about.</p>
          </div>
          <Link className="button button-green" href={currentUser ? "/posts/new" : "/login"}>Write a post <span aria-hidden="true">↗</span></Link>
        </section>

        <section className="featured-book-banner" aria-labelledby="featured-doom-title">
          <div className="featured-doom-cover">
            <Image
              alt="Doctor Doom comic cover"
              height={252}
              priority
              src="/images/books/doctor-doom.jpg"
              width={220}
            />
          </div>
          <div className="featured-doom-copy">
            <span className="eyebrow">A book for the bold</span>
            <h2 id="featured-doom-title">Doctor Doom</h2>
            <p>
              Enter the kingdom of a brilliant ruler with a mysterious past.
              Schemes, shadows, and impossible choices await anyone brave enough
              to open the first page.
            </p>
            <Link className="button featured-read-button" href="/groups">
              Are you ready? <span aria-hidden="true">→</span>
            </Link>
          </div>
          <span className="featured-doom-number" aria-hidden="true">4</span>
        </section>

        <section className="reading-history" aria-labelledby="reading-history-title">
          <div className="history-heading">
            <div>
              <span className="eyebrow light-eyebrow">Your reading journey</span>
              <h2 id="reading-history-title">Recently read</h2>
            </div>
            <Link className="small-link" href="/profile">
              View history <span aria-hidden="true">↗</span>
            </Link>
          </div>
          <div className="history-shelf">
            {readingHistory.map((book, index) => (
              <article className="history-book" key={book.title}>
                <Link
                  className="history-cover"
                  href="/books"
                  aria-label={`Open ${book.title} reading history`}
                >
                  <Image
                    alt={`Cover of ${book.title}`}
                    height={240}
                    priority={index < 3}
                    src={book.cover}
                    width={160}
                  />
                  <span className="history-progress" aria-label="Book read">
                    <span>{100 - index * 11}%</span>
                  </span>
                </Link>
                <h3>{book.title}</h3>
                <p>{book.author}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="home-discussions">
          <div className="shelf-heading">
            <div><span className="eyebrow light-eyebrow">From the reading room</span><h2>Recent conversations</h2></div>
            <Link href="/groups" className="small-link">See all discussions <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="post-list">
            {posts.slice(0, 2).map((post) => <PostCard key={post.id} post={post} />)}
          </div>
        </section>
      </section>
    </main>
  );
}
