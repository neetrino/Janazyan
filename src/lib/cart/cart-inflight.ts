/** Shared in-flight bust for cart network reads (avoids import cycles). */

let revalidateInflight: Promise<unknown> | null = null;
let revalidateGeneration = 0;

let loggedInCartInflight: Promise<unknown> | null = null;
let loggedInCartFetchGeneration = 0;

export function getRevalidateGeneration(): number {
  return revalidateGeneration;
}

export function getLoggedInCartFetchGeneration(): number {
  return loggedInCartFetchGeneration;
}

export function claimRevalidateInflight(
  generation: number,
  promise: Promise<unknown>,
): void {
  revalidateInflight = promise;
  revalidateGeneration = generation;
}

export function releaseRevalidateInflight(generation: number): void {
  if (revalidateGeneration === generation) {
    revalidateInflight = null;
  }
}

export function getRevalidateInflight(): Promise<unknown> | null {
  return revalidateInflight;
}

export function claimLoggedInCartInflight(
  generation: number,
  promise: Promise<unknown>,
): void {
  loggedInCartInflight = promise;
  loggedInCartFetchGeneration = generation;
}

export function releaseLoggedInCartInflight(generation: number): void {
  if (loggedInCartFetchGeneration === generation) {
    loggedInCartInflight = null;
  }
}

export function getLoggedInCartInflight(): Promise<unknown> | null {
  return loggedInCartInflight;
}

/** Drop all coalesced cart fetches started before a client mutation. */
export function bustCartInflight(): void {
  revalidateGeneration += 1;
  revalidateInflight = null;
  loggedInCartFetchGeneration += 1;
  loggedInCartInflight = null;
}

export function bumpRevalidateGenerationForForce(): number {
  revalidateGeneration += 1;
  revalidateInflight = null;
  return revalidateGeneration;
}

export function bumpLoggedInCartFetchGenerationForForce(): number {
  loggedInCartFetchGeneration += 1;
  loggedInCartInflight = null;
  return loggedInCartFetchGeneration;
}
