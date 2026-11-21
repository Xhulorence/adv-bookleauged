# BookLeagued

A cozy, responsive book community built with the Next.js App Router. The current demo is fully usable without a backend: accounts, books, discussions, comments, and profile changes are saved in the browser's local storage.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Create an account on `/signup`, or use **Explore as a guest** to try the seeded reading room. The guest account cannot log in with a password; use the guest button to activate it.

## Routes

- `/` — home, genre recommendations, featured books, and recent discussions
- `/login`, `/signup` — browser-only demo account flow
- `/books` — live title/author/genre search and genre filter
- `/books/[id]` — book details and related conversations
- `/books/new` — add a book (or edit one with `?edit=<id>`)
- `/groups` — discussion feed
- `/posts/new` — create a recommendation/discussion (or edit with `?edit=<id>`)
- `/posts/[id]` — post detail, comments, and own-comment editing/deletion
- `/profile` — profile, contributed books, posts, comments, and account deletion

## Local data layer

`lib/demo-store.tsx` provides seed data, TypeScript models, CRUD actions, and a React context. It persists to the browser key `bookleagued-demo-v1`. Components use the store API rather than accessing storage directly, so its actions can later be replaced with API/server actions and Prisma.

Passwords in the demo are salted and hashed with the browser Web Crypto PBKDF2 API before local storage. This is only a local prototype; client-side authentication and local storage do not protect real accounts or data. Add server-side authentication and password hashing before production.

## Structure

```text
app/
  books/
    [id]/page.tsx
    new/page.tsx
    page.tsx
  groups/page.tsx
  login/page.tsx
  posts/
    [id]/page.tsx
    new/page.tsx
  profile/page.tsx
  signup/page.tsx
  globals.css
  layout.tsx
  page.tsx
  providers.tsx
components/
  auth-form.tsx
  book-card.tsx
  book-detail.tsx
  book-form.tsx
  books-catalog.tsx
  post-card.tsx
  post-detail.tsx
  post-form.tsx
  site-header.tsx
lib/
  demo-store.tsx
prisma/
  schema.prisma
public/images/
  books/
  garden-doorway.jpg
  library.jpg
```

The supplied garden/library backgrounds and local cover images are used directly from `public/images`. A PostgreSQL/Prisma schema is retained at `prisma/schema.prisma` as a starting point for replacing the mock store.
