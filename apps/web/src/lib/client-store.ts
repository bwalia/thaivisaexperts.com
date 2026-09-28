"use client";

import { useSyncExternalStore } from "react";

/*
 * Browser state (URL query, localStorage) exposed as external stores via useSyncExternalStore.
 * The static HTML renders with the server snapshot; the client value applies right after hydration,
 * without setState-in-effect cascades.
 */

const URL_EVENT = "tve:url";
const STORAGE_EVENT = "tve:storage";

function subscribeUrl(cb: () => void) {
  window.addEventListener("popstate", cb);
  window.addEventListener(URL_EVENT, cb);
  return () => {
    window.removeEventListener("popstate", cb);
    window.removeEventListener(URL_EVENT, cb);
  };
}

/** The current query string ("" during static render). The URL is the source of truth for shareable UI state. */
export function useSearchString(): string {
  return useSyncExternalStore(
    subscribeUrl,
    () => window.location.search,
    () => "",
  );
}

/** Replace the query string without navigation and notify subscribers. */
export function replaceSearch(params: URLSearchParams | string) {
  const qs = String(params).replace(/^\?/, "");
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
  window.dispatchEvent(new Event(URL_EVENT));
}

function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  window.addEventListener(STORAGE_EVENT, cb);
  return () => {
    window.removeEventListener("storage", cb);
    window.removeEventListener(STORAGE_EVENT, cb);
  };
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null; // storage blocked (private mode, disabled site data)
  }
}

/** A localStorage value (null during static render or when storage is unavailable). Per-browser conveniences only. */
export function useStoredValue(key: string): string | null {
  return useSyncExternalStore(
    subscribeStorage,
    () => readStorage(key),
    () => null,
  );
}

export function setStoredValue(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

const noopSubscribe = () => () => {};

/** False during static render and hydration, true afterwards. */
export function useIsClient(): boolean {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}
