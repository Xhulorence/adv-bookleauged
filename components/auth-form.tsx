"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { useDemoStore } from "@/lib/demo-store";

export default function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const nameInputId = "signup-name";
  const emailInputId = `${mode}-email`;
  const passwordInputId = `${mode}-password`;
  const router = useRouter();
  const { signup, login, continueAsGuest } = useDemoStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (isSignup) await signup(name, email, password);
      else await login(email, password);
      router.push("/");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not complete sign in.");
    } finally {
      setBusy(false);
    }
  }

  function guest() {
    continueAsGuest();
    router.push("/");
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <Link className="auth-brand" href="/" aria-label="BookLeagued home">
          <Image
            alt="BookLeagued"
            className="auth-logo"
            height={321}
            priority
            src="/images/bookleagued-logo.png"
            width={689}
          />
        </Link>
        <span className="eyebrow">A cozy corner for readers</span>
        <h1>Welcome to <span>BookLeagued!</span></h1>
        <p className="auth-intro">{isSignup ? "Create your reader account and find your people." : "Come on in — your next favorite book is waiting."}</p>
        <form onSubmit={submit}>
          {isSignup && (
            <div className="form-field">
              <label htmlFor={nameInputId}>Your name</label>
              <input autoComplete="name" id={nameInputId} onChange={(event) => setName(event.target.value)} placeholder="How should we call you?" required value={name} />
            </div>
          )}
          <div className="form-field">
            <label htmlFor={emailInputId}>Email address</label>
            <input autoComplete="email" id={emailInputId} onChange={(event) => setEmail(event.target.value)} placeholder="reader@example.com" required type="email" value={email} />
          </div>
          <div className="form-field">
            <label htmlFor={passwordInputId}>Password</label>
            <input autoComplete={isSignup ? "new-password" : "current-password"} id={passwordInputId} minLength={8} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" required type="password" value={password} />
            <p className="field-hint">Password must contain at least 8 characters.</p>
          </div>
          {error && <p className="form-error" role="alert">{error}</p>}
          <button className="button button-green auth-submit" disabled={busy} type="submit">
            {busy ? "One moment..." : isSignup ? "Create Account" : "Log in"}
          </button>
        </form>
        <div className="auth-toggle">
          {isSignup ? "Already have an account?" : "New to the reading room?"}{" "}
          <Link href={isSignup ? "/login" : "/signup"}>{isSignup ? "Log in" : "Create Account"}</Link>
        </div>
        <button className="guest-button" onClick={guest} type="button">Explore as a guest</button>
        <p className="auth-disclaimer">Demo mode stores account and reading data in this browser only.</p>
      </section>
    </main>
  );
}
