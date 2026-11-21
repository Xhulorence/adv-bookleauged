"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDemoStore, type Post } from "@/lib/demo-store";

export default function PostCard({ post }: { post: Post }) {
  const router = useRouter();
  const { books, comments, currentUser, deletePost, getUser } = useDemoStore();
  const book = books.find((item) => item.id === post.bookId);
  const coverImageUrl = post.coverImageUrl || book?.coverImageUrl;
  const author = getUser(post.authorUserId);
  const owned = currentUser?.id === post.authorUserId;
  const commentCount = comments.filter((comment) => comment.postId === post.id).length;

  function removePost() {
    if (window.confirm("Delete this discussion and its comments?")) {
      deletePost(post.id);
      router.refresh();
    }
  }

  return (
    <article className="post-card">
      <div className="post-card-top">
        <div className="post-author">
          {author?.avatarImageUrl ? (
            <Image
              alt={`${author.name} profile`}
              className="profile-avatar profile-avatar-image"
              height={36}
              src={author.avatarImageUrl}
              unoptimized
              width={36}
            />
          ) : (
            <span className="profile-avatar">{author?.avatar.slice(0, 1) ?? "R"}</span>
          )}
          <div>
            <strong>{author?.name ?? "A reader"}</strong>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        {owned && (
          <div className="post-owner-actions">
            <Link href={`/posts/new?edit=${post.id}`}>Edit</Link>
            <button onClick={removePost} type="button">Delete</button>
          </div>
        )}
      </div>
      {(book || coverImageUrl) && (
        <div className="post-card-feature">
          {coverImageUrl && (
            <div className="post-card-cover">
              <Image alt={`Cover for ${post.title}`} height={180} src={coverImageUrl} unoptimized width={120} />
            </div>
          )}
          <div className="post-card-copy">
            {book && <Link className="post-book-tag" href={`/books/${book.id}`}>Reading: {book.title}</Link>}
            <h2><Link href={`/posts/${post.id}`}>{post.title}</Link></h2>
            <p className="post-excerpt">{post.description}</p>
            {post.readingUrl && (
              <a className="post-reading-link" href={post.readingUrl} rel="noopener noreferrer" target="_blank">
                Where to read <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        </div>
      )}
      {!book && !coverImageUrl && (
        <>
          <h2><Link href={`/posts/${post.id}`}>{post.title}</Link></h2>
          <p className="post-excerpt">{post.description}</p>
          {post.readingUrl && (
            <a className="post-reading-link" href={post.readingUrl} rel="noopener noreferrer" target="_blank">
              Where to read <span aria-hidden="true">↗</span>
            </a>
          )}
        </>
      )}
      <Link className="post-read-link" href={`/posts/${post.id}`}>
        Read discussion <span>·</span> {commentCount} {commentCount === 1 ? "comment" : "comments"} <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}
