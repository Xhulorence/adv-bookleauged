"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Reader = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  avatarImageUrl?: string;
  bio: string;
  passwordHash: string;
  createdAt: string;
};

export type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverImageUrl: string;
  description: string;
  addedByUserId: string;
  createdAt: string;
};

export type Post = {
  id: string;
  title: string;
  description: string;
  bookId?: string;
  coverImageUrl?: string;
  readingUrl?: string;
  authorUserId: string;
  createdAt: string;
  updatedAt: string;
};

export type Comment = {
  id: string;
  content: string;
  postId: string;
  authorUserId: string;
  createdAt: string;
};

type StoreData = {
  users: Reader[];
  books: Book[];
  posts: Post[];
  comments: Comment[];
  currentUserId: string | null;
};

type AppStore = StoreData & {
  ready: boolean;
  currentUser: Reader | null;
  signup: (name: string, email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
  updateProfile: (name: string, bio: string, avatar: string, avatarImageUrl?: string) => void;
  deleteAccount: () => void;
  saveBook: (book: Omit<Book, "id" | "createdAt" | "addedByUserId">, id?: string) => void;
  deleteBook: (id: string) => void;
  savePost: (post: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorUserId">, id?: string) => string;
  deletePost: (id: string) => void;
  saveComment: (content: string, postId: string, id?: string) => void;
  deleteComment: (id: string) => void;
  getUser: (id: string) => Reader | undefined;
};

const STORAGE_KEY = "bookleagued-demo-v1";
const seededAt = "2026-01-15T12:00:00.000Z";
const demoReader: Reader = {
  id: "reader-demo",
  name: "Willow Reader",
  email: "reader@bookleagued.demo",
  avatar: "W",
  avatarImageUrl: "/images/profile-dog.jpg",
  bio: "Usually found with a cup of tea and one more chapter.",
  passwordHash: "",
  createdAt: seededAt,
};

const initialBooks: Book[] = [
  {
    id: "broken-rival",
    title: "Broken Rival",
    author: "Tessa Bailey",
    genre: "Romance",
    coverImageUrl: "/images/books/broken-rival.jpg",
    description: "A tender, lively romance full of complicated feelings, sharp banter, and second chances.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "trust",
    title: "Trust",
    author: "Hernan Diaz",
    genre: "Literary Fiction",
    coverImageUrl: "/images/books/trust.jpg",
    description: "A richly layered novel about wealth, storytelling, and the many versions of a life.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "married-little-christmas",
    title: "A Married Little Christmas",
    author: "Abby Jimenez",
    genre: "Romance",
    coverImageUrl: "/images/books/married-little-christmas.jpg",
    description: "A cozy holiday romance about choosing each other and finding a little magic at home.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "sherlock-holmes",
    title: "The Complete Sherlock Holmes",
    author: "Arthur Conan Doyle",
    genre: "Mystery",
    coverImageUrl: "/images/books/sherlock-holmes.jpg",
    description: "Classic mysteries featuring the sharp-eyed detective Sherlock Holmes and Dr. Watson.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "to-dream-in-darkness",
    title: "To Dream in Darkness",
    author: "Ann Liang",
    genre: "Fantasy",
    coverImageUrl: "/images/books/to-dream-in-darkness.jpg",
    description: "A dreamy, atmospheric story with a touch of the uncanny and a world worth wandering.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "witchcraft-for-wayward-girls",
    title: "Witchcraft for Wayward Girls",
    author: "Grady Hendrix",
    genre: "Horror",
    coverImageUrl: "/images/books/witchcraft-for-wayward-girls.jpg",
    description: "A chilling tale of young women, strange power, and the secrets hidden behind closed doors.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "trad-wife",
    title: "Trad Wife",
    author: "Sarah Langan",
    genre: "Thriller",
    coverImageUrl: "/images/books/trad-wife.jpg",
    description: "A sharp, unsettling thriller about identity, ambition, and a picture-perfect life.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "holy-bible",
    title: "The Holy Bible",
    author: "Various authors",
    genre: "Classics",
    coverImageUrl: "/images/books/holy-bible.jpg",
    description: "A foundational collection of sacred texts, poetry, stories, and teachings.",
    addedByUserId: demoReader.id,
    createdAt: seededAt,
  },
];

const initialPosts: Post[] = [
  {
    id: "post-cozy-romance",
    title: "A romance that feels like coming home",
    description: "Broken Rival was such a warm surprise. I loved the playful dialogue and how the characters slowly learned to trust each other. What is your favorite feel-good romance?",
    bookId: "broken-rival",
    coverImageUrl: "/images/books/broken-rival.jpg",
    readingUrl: "https://www.google.com/search?q=Broken+Rival+Tessa+Bailey",
    authorUserId: demoReader.id,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
  {
    id: "post-holmes",
    title: "Sherlock Holmes still has the best reveal",
    description: "I revisited these stories on a rainy weekend and got completely swept up in the clues again. Share your favorite mystery that kept you guessing.",
    bookId: "sherlock-holmes",
    coverImageUrl: "/images/books/sherlock-holmes.jpg",
    readingUrl: "https://www.google.com/search?q=The+Complete+Sherlock+Holmes",
    authorUserId: demoReader.id,
    createdAt: seededAt,
    updatedAt: seededAt,
  },
];

const initialComments: Comment[] = [
  {
    id: "comment-willow",
    content: "This sounds lovely. Adding it to my weekend reading stack!",
    postId: "post-cozy-romance",
    authorUserId: demoReader.id,
    createdAt: seededAt,
  },
  {
    id: "comment-mystery",
    content: "The clues are so satisfying on a reread, too.",
    postId: "post-holmes",
    authorUserId: demoReader.id,
    createdAt: seededAt,
  },
];

function makeInitialStore(): StoreData {
  return {
    users: [demoReader],
    books: initialBooks,
    posts: initialPosts,
    comments: initialComments,
    currentUserId: demoReader.id,
  };
}

function makeId(prefix: string) {
  return `${prefix}-${globalThis.crypto?.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`}`;
}

async function hashPassword(password: string, salt?: string) {
  const saltBytes = salt
    ? Uint8Array.from(salt.match(/.{2}/g)?.map((part) => Number.parseInt(part, 16)) ?? [])
    : crypto.getRandomValues(new Uint8Array(16));
  const saltHex = Array.from(saltBytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  const bytes = new TextEncoder().encode(password);
  const key = await crypto.subtle.importKey("raw", bytes, "PBKDF2", false, ["deriveBits"]);
  const digest = await crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: saltBytes, iterations: 120_000, hash: "SHA-256" },
    key,
    256,
  );
  const hash = Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hash}`;
}

const StoreContext = createContext<AppStore | null>(null);

export function DemoStoreProvider({ children }: { children: ReactNode }) {
  const [store, setStore] = useState<StoreData>(makeInitialStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved) as StoreData;
          if (Array.isArray(parsed.users) && Array.isArray(parsed.books) && Array.isArray(parsed.posts) && Array.isArray(parsed.comments)) {
            const seededPostFields: Record<string, Pick<Post, "coverImageUrl" | "readingUrl">> = {
              "post-cozy-romance": {
                coverImageUrl: "/images/books/broken-rival.jpg",
                readingUrl: "https://www.google.com/search?q=Broken+Rival+Tessa+Bailey",
              },
              "post-holmes": {
                coverImageUrl: "/images/books/sherlock-holmes.jpg",
                readingUrl: "https://www.google.com/search?q=The+Complete+Sherlock+Holmes",
              },
            };
            setStore({
              ...parsed,
              users: parsed.users.map((user) => ({
                ...user,
                avatarImageUrl: user.avatarImageUrl ?? (user.id === demoReader.id ? "/images/profile-dog.jpg" : undefined),
              })),
              posts: parsed.posts.map((post) => ({
                ...post,
                coverImageUrl: post.coverImageUrl ?? seededPostFields[post.id]?.coverImageUrl,
                readingUrl: post.readingUrl ?? seededPostFields[post.id]?.readingUrl,
              })),
            });
          }
        }
      } catch (error) {
        console.error("Could not load the BookLeagued demo data.", error);
      } finally {
        setReady(true);
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch (error) {
      console.error("Could not save the BookLeagued demo data.", error);
    }
  }, [ready, store]);

  const signup = useCallback(async (name: string, email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (!name.trim()) throw new Error("Please enter your name.");
    if (password.length < 8) throw new Error("Your password must be at least 8 characters.");
    if (store.users.some((user) => user.email === normalizedEmail)) {
      throw new Error("An account with that email already exists.");
    }
    const passwordHash = await hashPassword(password);
    setStore((current) => {
      const user: Reader = {
        id: makeId("reader"),
        name: name.trim(),
        email: normalizedEmail,
        avatar: name.trim().slice(0, 1).toUpperCase() || "R",
        avatarImageUrl: "/images/profile-dog.jpg",
        bio: "",
        passwordHash,
        createdAt: new Date().toISOString(),
      };
      return { ...current, users: [...current.users, user], currentUserId: user.id };
    });
  }, [store.users]);

  const login = useCallback(async (email: string, password: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const user = store.users.find((item) => item.email === normalizedEmail);
    const [salt, savedHash] = user?.passwordHash.split(":") ?? [];
    const passwordHash = user && salt ? await hashPassword(password, salt) : "";
    if (!user || !savedHash || user.passwordHash !== passwordHash) {
      throw new Error("That email and password do not match an account.");
    }
    setStore((current) => {
      return { ...current, currentUserId: user.id };
    });
  }, [store.users]);

  const continueAsGuest = useCallback(() => {
    setStore((current) => ({
      ...current,
      users: current.users.some((user) => user.id === demoReader.id)
        ? current.users
        : [...current.users, demoReader],
      currentUserId: demoReader.id,
    }));
  }, []);

  const logout = useCallback(() => {
    setStore((current) => ({ ...current, currentUserId: null }));
  }, []);

  const updateProfile = useCallback((name: string, bio: string, avatar: string, avatarImageUrl?: string) => {
    setStore((current) => ({
      ...current,
      users: current.users.map((user) =>
        user.id === current.currentUserId
          ? {
              ...user,
              name: name.trim(),
              bio: bio.trim(),
              avatar: avatar.trim().slice(0, 2) || "R",
              avatarImageUrl: avatarImageUrl || user.avatarImageUrl,
            }
          : user,
      ),
    }));
  }, []);

  const deleteAccount = useCallback(() => {
    setStore((current) => {
      const userId = current.currentUserId;
      if (!userId) return current;
      const postIds = new Set(current.posts.filter((post) => post.authorUserId === userId).map((post) => post.id));
      return {
        ...current,
        users: current.users.filter((user) => user.id !== userId),
        books: current.books.filter((book) => book.addedByUserId !== userId),
        posts: current.posts.filter((post) => post.authorUserId !== userId),
        comments: current.comments.filter((comment) => comment.authorUserId !== userId && !postIds.has(comment.postId)),
        currentUserId: null,
      };
    });
  }, []);

  const saveBook = useCallback((input: Omit<Book, "id" | "createdAt" | "addedByUserId">, id?: string) => {
    if (!input.title.trim() || !input.author.trim() || !input.description.trim()) {
      throw new Error("Title, author, and description are required.");
    }
    setStore((current) => {
      if (!current.currentUserId) return current;
      if (id) {
        return {
          ...current,
          books: current.books.map((book) =>
            book.id === id && book.addedByUserId === current.currentUserId ? { ...book, ...input } : book,
          ),
        };
      }
      return {
        ...current,
        books: [
          { ...input, id: makeId("book"), createdAt: new Date().toISOString(), addedByUserId: current.currentUserId },
          ...current.books,
        ],
      };
    });
  }, []);

  const deleteBook = useCallback((id: string) => {
    setStore((current) => {
      if (!current.currentUserId) return current;
      return {
        ...current,
        books: current.books.filter((book) => !(book.id === id && book.addedByUserId === current.currentUserId)),
        posts: current.posts.map((post) => post.bookId === id ? { ...post, bookId: undefined } : post),
      };
    });
  }, []);

  const savePost = useCallback((input: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorUserId">, id?: string) => {
    if (!input.title.trim() || !input.description.trim()) {
      throw new Error("A title and description are required.");
    }
    const newId = id ?? makeId("post");
    setStore((current) => {
      if (!current.currentUserId) return current;
      const existing = current.posts.find((post) => post.id === id);
      if (existing) {
        return {
          ...current,
          posts: current.posts.map((post) =>
            post.id === id && post.authorUserId === current.currentUserId
              ? { ...post, ...input, updatedAt: new Date().toISOString() }
              : post,
          ),
        };
      }
      return {
        ...current,
        posts: [
          {
            ...input,
            id: newId,
            authorUserId: current.currentUserId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
          ...current.posts,
        ],
      };
    });
    return newId;
  }, []);

  const deletePost = useCallback((id: string) => {
    setStore((current) => {
      if (!current.currentUserId) return current;
      const post = current.posts.find((item) => item.id === id);
      if (!post || post.authorUserId !== current.currentUserId) return current;
      return {
        ...current,
        posts: current.posts.filter((item) => item.id !== id),
        comments: current.comments.filter((comment) => comment.postId !== id),
      };
    });
  }, []);

  const saveComment = useCallback((content: string, postId: string, id?: string) => {
    if (!content.trim()) throw new Error("A comment cannot be empty.");
    setStore((current) => {
      if (!current.currentUserId) return current;
      if (id) {
        return {
          ...current,
          comments: current.comments.map((comment) =>
            comment.id === id && comment.authorUserId === current.currentUserId
              ? { ...comment, content: content.trim() }
              : comment,
          ),
        };
      }
      return {
        ...current,
        comments: [
          ...current.comments,
          { id: makeId("comment"), content: content.trim(), postId, authorUserId: current.currentUserId, createdAt: new Date().toISOString() },
        ],
      };
    });
  }, []);

  const deleteComment = useCallback((id: string) => {
    setStore((current) => ({
      ...current,
      comments: current.comments.filter((comment) => !(comment.id === id && comment.authorUserId === current.currentUserId)),
    }));
  }, []);

  const getUser = useCallback((id: string) => store.users.find((user) => user.id === id), [store.users]);
  const currentUser = store.users.find((user) => user.id === store.currentUserId) ?? null;

  const value = useMemo<AppStore>(() => ({
    ...store,
    ready,
    currentUser,
    signup,
    login,
    continueAsGuest,
    logout,
    updateProfile,
    deleteAccount,
    saveBook,
    deleteBook,
    savePost,
    deletePost,
    saveComment,
    deleteComment,
    getUser,
  }), [store, ready, currentUser, signup, login, continueAsGuest, logout, updateProfile, deleteAccount, saveBook, deleteBook, savePost, deletePost, saveComment, deleteComment, getUser]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useDemoStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useDemoStore must be used inside DemoStoreProvider.");
  return context;
}

export const bookGenres = ["Romance", "Mystery", "Science Fiction", "Fantasy", "Historical Fiction", "Thriller", "Horror", "Literary Fiction", "Classics", "Other"];
