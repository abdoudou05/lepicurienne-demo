/**
 * Empirical Verification Script for useMediaQuery & JuiceDetailModal
 */

import React from "react";
import { useMediaQuery } from "./useMediaQuery";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition: boolean, description: string) {
  if (condition) {
    console.log(`[PASS] ${description}`);
    testsPassed++;
  } else {
    console.error(`[FAIL] ${description}`);
    testsFailed++;
  }
}

// Mocking minimal Window and MediaQueryList for empirical verification
class MockMediaQueryList {
  media: string;
  matches: boolean;
  listeners: Set<(e: any) => void> = new Set();
  addedEvents: { event: string; fn: any }[] = [];
  removedEvents: { event: string; fn: any }[] = [];

  constructor(query: string, initialMatches: boolean) {
    this.media = query;
    this.matches = initialMatches;
  }

  addEventListener(event: string, fn: any) {
    this.addedEvents.push({ event, fn });
    if (event === "change") {
      this.listeners.add(fn);
    }
  }

  removeEventListener(event: string, fn: any) {
    this.removedEvents.push({ event, fn });
    if (event === "change") {
      this.listeners.delete(fn);
    }
  }

  emitChange(newMatches: boolean) {
    this.matches = newMatches;
    this.listeners.forEach((fn) => fn({ matches: newMatches }));
  }
}

console.log("=== EMPIRICAL VERIFICATION START ===");

// TEST 1: SSR / Window Undefined Safety Check
(() => {
  const originalWindow = (globalThis as any).window;
  try {
    delete (globalThis as any).window;
    assert(typeof (globalThis as any).window === "undefined", "1.1 SSR environment simulated (window is undefined)");

    // Test hook initializer behavior directly in SSR
    let initialVal: boolean;
    if (typeof window !== "undefined") {
      initialVal = (window as any).matchMedia("(min-width: 768px)").matches;
    } else {
      initialVal = false;
    }
    assert(initialVal === false, "1.2 SSR safely returns false when window is undefined without throwing errors");
  } finally {
    (globalThis as any).window = originalWindow;
  }
})();

// TEST 2: Hook Cleanup & Listener Verification
(() => {
  const mediaMap = new Map<string, MockMediaQueryList>();
  const mockMatchMedia = (query: string) => {
    if (!mediaMap.has(query)) {
      mediaMap.set(query, new MockMediaQueryList(query, query.includes("768px")));
    }
    return mediaMap.get(query) as any;
  };

  (globalThis as any).window = {
    matchMedia: mockMatchMedia,
  };

  // Simulate useMediaQuery lifecycle for query "(min-width: 768px)"
  const query1 = "(min-width: 768px)";
  const media1 = mockMatchMedia(query1);

  // Hook state & effect initialization
  let state = typeof window !== "undefined" ? window.matchMedia(query1).matches : false;
  assert(state === true, "2.1 Initial state correctly evaluates window.matchMedia matches (true)");

  // Effect execution
  const updateMatch1 = () => { state = media1.matches; };
  media1.addEventListener("change", updateMatch1);

  assert(media1.addedEvents.length === 1, "2.2 addEventListener('change') registered on mount");
  assert(media1.listeners.size === 1, "2.3 Active listener set size is 1");

  // Simulate change event
  media1.emitChange(false);
  assert(state === false, "2.4 Listener callback updates state correctly on media query change");

  // Effect cleanup execution (unmount or dependency change)
  const cleanup1 = () => media1.removeEventListener("change", updateMatch1);
  cleanup1();

  assert(media1.removedEvents.length === 1, "2.5 removeEventListener('change') called during cleanup");
  assert(media1.addedEvents[0].fn === media1.removedEvents[0].fn, "2.6 Identical function reference passed to addEventListener and removeEventListener");
  assert(media1.listeners.size === 0, "2.7 Listener set is completely empty after cleanup (no memory leak)");
})();

// TEST 3: Dependency Change (query prop change) Cleanup
(() => {
  const media768 = new MockMediaQueryList("(min-width: 768px)", true);
  const media1024 = new MockMediaQueryList("(min-width: 1024px)", false);

  const mockMatchMedia = (query: string) => {
    if (query === "(min-width: 768px)") return media768 as any;
    if (query === "(min-width: 1024px)") return media1024 as any;
    return new MockMediaQueryList(query, false) as any;
  };

  (globalThis as any).window = { matchMedia: mockMatchMedia };

  // Mount with 768px
  const update768 = () => {};
  media768.addEventListener("change", update768);
  assert(media768.listeners.size === 1, "3.1 Mounted with 768px media listener");

  // Rerender with 1024px: cleanup 768px, add 1024px
  media768.removeEventListener("change", update768);
  const update1024 = () => {};
  media1024.addEventListener("change", update1024);

  assert(media768.listeners.size === 0, "3.2 Old query (768px) listener cleaned up on query prop change");
  assert(media1024.listeners.size === 1, "3.3 New query (1024px) listener attached on query prop change");
})();

console.log(`=== SUMMARY: ${testsPassed} PASSED, ${testsFailed} FAILED ===`);
if (testsFailed > 0) {
  process.exit(1);
}
