"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import BookCard from "@/components/book-card";
import PostCard from "@/components/post-card";
import { useDemoStore, type Reader } from "@/lib/demo-store";

export default function ProfilePage() {
  const { currentUser, ready } = useDemoStore();
  if (!ready) return <main className="content-page"><div className="empty-state glass-panel">Opening your profile…</div></main>;
  if (!currentUser) return <main className="content-page"><div className="empty-state glass-panel"><h2>Sign in to view your profile.</h2><Link className="button button-green" href="/login">Log in</Link></div></main>;
  return <ProfileEditor currentUser={currentUser} />;
}

function ProfileEditor({ currentUser }: { currentUser: Reader }) {
  const router = useRouter();
  const { books, comments, deleteAccount, deleteBook, deleteComment, posts, updateProfile, getUser } = useDemoStore();
  const [name, setName] = useState(currentUser.name);
  const [bio, setBio] = useState(currentUser.bio);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [avatarImageUrl, setAvatarImageUrl] = useState(currentUser.avatarImageUrl ?? "/images/profile-dog.jpg");
  const [saved, setSaved] = useState(false);
  const [profileError, setProfileError] = useState("");

  const ownBooks = books.filter((book) => book.addedByUserId === currentUser.id);
  const ownPosts = posts.filter((post) => post.authorUserId === currentUser.id);
  const ownComments = comments.filter((comment) => comment.authorUserId === currentUser.id);

  function submitProfile(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setProfileError("Please enter a display name.");
      return;
    }
    setProfileError("");
    updateProfile(name, bio, avatar, avatarImageUrl);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2500);
  }

  function removeBook(bookId: string) {
    if (window.confirm("Remove this book from the collection? Its discussions will remain, without a linked book.")) deleteBook(bookId);
  }

  function removeAccount() {
    const confirmed = window.confirm("Delete your demo account and your books, posts, and comments? This cannot be undone.");
    if (confirmed) {
      deleteAccount();
      router.push("/signup");
    }
  }

  function handleAvatarUpload(file?: File) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setProfileError("Please choose an image file.");
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setProfileError("Please choose an image smaller than 2 MB.");
      return;
    }
    setProfileError("");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") setAvatarImageUrl(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <main className="content-page profile-page">
      <section className="page-intro"><span className="eyebrow light-eyebrow">Your reading nook</span><h1>Hello, <span>{name.trim().split(" ")[0] || currentUser.name.split(" ")[0]}.</span></h1><p>Keep your profile and contributions just the way you like them.</p></section>
      <form className="composer-card profile-form" onSubmit={submitProfile}>
        <div className="composer-topline">
          <div><span className="eyebrow">About you</span><h2>Reader profile</h2></div>
          <label className="profile-photo-picker" htmlFor="profile-photo">
            <Image
              alt={`${name || currentUser.name} profile`}
              className="profile-avatar profile-avatar-large profile-avatar-image"
              height={46}
              src={avatarImageUrl}
              unoptimized
              width={46}
            />
            <span>Change photo</span>
          </label>
          <input
            accept="image/*"
            className="sr-only"
            id="profile-photo"
            onChange={(event) => handleAvatarUpload(event.target.files?.[0])}
            type="file"
          />
        </div>
        <div className="form-field"><label htmlFor="profile-name">Display name</label><input id="profile-name" onChange={(event) => setName(event.target.value)} required value={name} /></div>
        <div className="form-field"><label htmlFor="profile-email">Email</label><input id="profile-email" readOnly value={currentUser.email} /></div>
        <div className="form-field"><label htmlFor="profile-avatar">Avatar initials <span>(1–2 characters)</span></label><input id="profile-avatar" maxLength={2} onChange={(event) => setAvatar(event.target.value)} value={avatar} /></div>
        <div className="form-field"><label htmlFor="profile-bio">A little about you</label><textarea id="profile-bio" maxLength={240} onChange={(event) => setBio(event.target.value)} placeholder="What do you love to read?" rows={3} value={bio} /></div>
        {profileError && <p className="form-error" role="alert">{profileError}</p>}
        <div className="form-actions"><span className="success-message" aria-live="polite">{saved ? "Profile saved!" : ""}</span><button className="button button-green" type="submit">Save profile</button></div>
      </form>

      <section className="profile-section">
        <div className="shelf-heading"><div><span className="eyebrow light-eyebrow">Your contributions</span><h2>Your books ({ownBooks.length})</h2></div><Link className="button button-green" href="/books/new">＋ Add a book</Link></div>
        {ownBooks.length ? <div className="catalog-grid">{ownBooks.map((book) => <div className="managed-book" key={book.id}><BookCard book={book} /><div className="post-owner-actions"><Link href={`/books/new?edit=${book.id}`}>Edit</Link><button onClick={() => removeBook(book.id)} type="button">Delete</button></div></div>)}</div> : <div className="empty-state glass-panel"><p>You haven’t added a book yet.</p></div>}
      </section>

      <section className="profile-section">
        <div className="shelf-heading"><div><span className="eyebrow light-eyebrow">Your conversations</span><h2>Your posts ({ownPosts.length})</h2></div><Link className="small-link" href="/posts/new">Write a post ↗</Link></div>
        {ownPosts.length ? <div className="post-list">{ownPosts.map((post) => <PostCard key={post.id} post={post} />)}</div> : <div className="empty-state glass-panel"><p>Your thoughts will show up here when you start a discussion.</p></div>}
      </section>

      <section className="profile-section">
        <div className="shelf-heading"><div><span className="eyebrow light-eyebrow">Your replies</span><h2>Your comments ({ownComments.length})</h2></div></div>
        <div className="comment-list">
          {ownComments.map((comment) => {
            const post = posts.find((item) => item.id === comment.postId);
            return <article className="comment-card glass-panel" key={comment.id}><div className="comment-heading"><strong>On: {post?.title ?? "Discussion"}</strong><div className="post-owner-actions">{post && <Link href={`/posts/${post.id}`}>Open</Link>}<button onClick={() => { if (window.confirm("Remove this comment?")) deleteComment(comment.id); }} type="button">Delete</button></div></div><p>{comment.content}</p>{post && <span className="comment-author">Conversation by {getUser(post.authorUserId)?.name ?? "a reader"}</span>}</article>;
          })}
          {!ownComments.length && <div className="empty-state glass-panel"><p>Your comments on reader discussions will appear here.</p></div>}
        </div>
      </section>

      <section className="danger-zone"><div><h2>Leave the reading room?</h2><p>Delete your demo account and all your contributions from this browser.</p></div><button className="button button-danger" onClick={removeAccount} type="button">Delete account</button></section>
    </main>
  );
}
