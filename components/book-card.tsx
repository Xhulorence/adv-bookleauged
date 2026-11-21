import Image from "next/image";
import Link from "next/link";
import type { Book } from "@/lib/demo-store";

export default function BookCard({ book, priority = false }: { book: Book; priority?: boolean }) {
  return (
    <article className="book-card">
      <Link className="book-cover-link" href={`/books/${book.id}`} aria-label={`View ${book.title}`}>
        <Image
          src={book.coverImageUrl || "/images/books/holy-bible.jpg"}
          alt={`Cover of ${book.title}`}
          width={280}
          height={420}
          className="book-cover"
          unoptimized
          priority={priority}
        />
      </Link>
      <div className="book-meta">
        <span>{book.genre}</span>
        <h3><Link href={`/books/${book.id}`}>{book.title}</Link></h3>
        <p>{book.author}</p>
      </div>
    </article>
  );
}
