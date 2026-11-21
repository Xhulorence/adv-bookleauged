"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use, useState, type FormEvent } from "react";
import { useDemoStore } from "@/lib/demo-store";

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const { books, comments, currentUser, deleteComment, posts, saveComment, getUser } = useDemoStore();
  const [commentText, setCommentText] = useState("");
  const [editingComment, setEditingComment] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const post = posts.find((item) => item.id === id);
  if (!post) return <main className="content-page"><div className="empty-state glass-panel"><span>✿</span><h1>That conversation has ended.</h1><Link href="/groups">Browse discussions</Link></div></main>;
  const postId = post.id;
  const book = books.find((item) => item.id === post.bookId);
  const coverImageUrl = post.coverImageUrl || book?.coverImageUrl;
  const author = getUser(post.authorUserId);
  const threadComments = comments.filter((item) => item.postId === post.id).sort((a, b) => a.createdAt.localeCompare(b.createdAt));

  function addComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    if (!commentText.trim()) return;
    saveComment(commentText, postId);
    setCommentText("");
  }

  function updateComment(event: FormEvent<HTMLFormElement>, commentId: string) {
    event.preventDefault();
    if (!editText.trim()) return;
    saveComment(editText, postId, commentId);
    setEditingComment(null);
  }

  function removeComment(commentId: string) {
    if (window.confirm("Remove your comment?")) deleteComment(commentId);
  }

  return (
    <main className="content-page post-detail-page">
      <Link className="back-link" href="/groups"><span aria-hidden="true">←</span> Back to conversations</Link>
      <article className="post-detail-card glass-panel">
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
          <div><strong>{author?.name ?? "A reader"}</strong><span>{new Date(post.createdAt).toLocaleDateString()}</span></div>
        </div>
        {book && <Link className="post-book-tag" href={`/books/${book.id}`}>Reading: {book.title}</Link>}
        {(coverImageUrl || post.readingUrl) && (
          <div className="post-detail-feature">
            {coverImageUrl && (
              <div className="post-detail-cover">
                <Image alt={`Cover for ${post.title}`} height={300} src={coverImageUrl} unoptimized width={200} />
              </div>
            )}
            {post.readingUrl && (
              <a className="button button-green" href={post.readingUrl} rel="noopener noreferrer" target="_blank">
                Read this book <span aria-hidden="true">↗</span>
              </a>
            )}
          </div>
        )}
        <h1>{post.title}</h1>
        <p className="post-full-content">{post.description}</p>
        <div className="detail-actions">
          {currentUser?.id === post.authorUserId && <Link className="button button-quiet" href={`/posts/new?edit=${post.id}`}>Edit post</Link>}
          {book && <Link className="button button-quiet" href={`/books/${book.id}`}>Book details</Link>}
        </div>
      </article>

      <section className="comments-section">
        <div className="shelf-heading"><div><span className="eyebrow light-eyebrow">Keep the conversation kind</span><h2>Comments ({threadComments.length})</h2></div></div>
        <div className="comment-list">
          {threadComments.map((comment) => {
            const commenter = getUser(comment.authorUserId);
            const ownsComment = currentUser?.id === comment.authorUserId;
            return (
              <article className="comment-card glass-panel" key={comment.id}>
                <div className="comment-heading">
                  <div className="post-author">
                    {commenter?.avatarImageUrl ? (
                      <Image
                        alt={`${commenter.name} profile`}
                        className="profile-avatar profile-avatar-image"
                        height={36}
                        src={commenter.avatarImageUrl}
                        unoptimized
                        width={36}
                      />
                    ) : (
                      <span className="profile-avatar">{commenter?.avatar.slice(0, 1) ?? "R"}</span>
                    )}
                    <div><strong>{commenter?.name ?? "A reader"}</strong><span>{new Date(comment.createdAt).toLocaleDateString()}</span></div>
                  </div>
                  {ownsComment && editingComment !== comment.id && <div className="post-owner-actions"><button onClick={() => { setEditingComment(comment.id); setEditText(comment.content); }} type="button">Edit</button><button onClick={() => removeComment(comment.id)} type="button">Delete</button></div>}
                </div>
                {editingComment === comment.id ? (
                  <form className="comment-form edit-comment-form" onSubmit={(event) => updateComment(event, comment.id)}>
                    <textarea aria-label="Edit comment" onChange={(event) => setEditText(event.target.value)} required rows={3} value={editText} />
                    <button className="button button-green" type="submit">Save comment</button>
                    <button className="button button-quiet" onClick={() => setEditingComment(null)} type="button">Cancel</button>
                  </form>
                ) : <p>{comment.content}</p>}
              </article>
            );
          })}
          {!threadComments.length && <div className="empty-state glass-panel"><p>No comments yet. Be the first reader to say hello.</p></div>}
        </div>
        <form className="comment-form glass-panel" onSubmit={addComment}>
          <label htmlFor="new-comment">Add your thought</label>
          <textarea id="new-comment" onChange={(event) => setCommentText(event.target.value)} placeholder={currentUser ? "What would you like to add?" : "Log in to join the conversation"} required={Boolean(currentUser)} rows={3} value={commentText} />
          <button className="button button-green" type="submit">{currentUser ? "Post comment" : "Log in to comment"} <span>↗</span></button>
        </form>
      </section>
    </main>
  );
}
