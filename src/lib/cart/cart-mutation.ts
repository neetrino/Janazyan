import { bustCartInflight } from './cart-inflight';

/** Monotonic epoch — any in-flight fetch started before a bump is stale. */
let mutationEpoch = 0;

/** Marks a client-side cart mutation and busts coalesced network reads. */
export function markCartMutation(): number {
  mutationEpoch += 1;
  bustCartInflight();
  return mutationEpoch;
}

/** Current mutation epoch (for fetch guards). */
export function getCartMutationEpoch(): number {
  return mutationEpoch;
}

/** True when no client mutation happened since `epochAtStart`. */
export function isCartMutationEpochCurrent(epochAtStart: number): boolean {
  return mutationEpoch === epochAtStart;
}
