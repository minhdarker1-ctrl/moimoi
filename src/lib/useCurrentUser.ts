"use client";

import { useEffect, useState } from "react";
import { AuthUser } from "@/lib/auth";

let cachedUser: AuthUser | null | undefined = undefined;
let inflightPromise: Promise<AuthUser | null> | null = null;
const listeners = new Set<(user: AuthUser | null) => void>();

export function fetchCurrentUser(): Promise<AuthUser | null> {
  if (cachedUser !== undefined) {
    return Promise.resolve(cachedUser);
  }

  if (inflightPromise) {
    return inflightPromise;
  }

  inflightPromise = fetch("/api/auth/me")
    .then((r) => r.json())
    .then((data) => {
      cachedUser = data?.user || null;
      listeners.forEach((listener) => listener(cachedUser ?? null));
      return cachedUser ?? null;
    })
    .catch(() => {
      cachedUser = null;
      listeners.forEach((listener) => listener(null));
      return null;
    })
    .finally(() => {
      inflightPromise = null;
    });

  return inflightPromise;
}

export function mutateCurrentUser(nextUser: AuthUser | null) {
  cachedUser = nextUser;
  listeners.forEach((listener) => listener(nextUser));
}

export function useCurrentUser() {
  const [user, setUser] = useState<AuthUser | null>(cachedUser ?? null);
  const [loading, setLoading] = useState<boolean>(cachedUser === undefined);

  useEffect(() => {
    let mounted = true;

    const handleUpdate = (newUser: AuthUser | null) => {
      if (mounted) {
        setUser(newUser);
        setLoading(false);
      }
    };

    listeners.add(handleUpdate);

    if (cachedUser === undefined) {
      fetchCurrentUser().then((u) => {
        if (mounted) {
          setUser(u);
          setLoading(false);
        }
      });
    } else {
      setLoading(false);
    }

    return () => {
      mounted = false;
      listeners.delete(handleUpdate);
    };
  }, []);

  return { user, loading, mutate: mutateCurrentUser };
}
