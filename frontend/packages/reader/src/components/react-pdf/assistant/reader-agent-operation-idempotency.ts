// Idempotency-key storage for agent operation actions. Keys are scoped per
// operation+action, cached in a Map for the current page, and mirrored to
// sessionStorage so a reload can replay the same action key. Prefix and
// behavior are unchanged from the original hook.

import { ACTION_KEY_PREFIX, makeActionKey } from "./reader-agent-operation-model.js";

function storageSlotFor(operationId: string, action: string): string {
  return `${ACTION_KEY_PREFIX}${operationId}:${action}`;
}

export function resolveAgentOperationActionKey(
  operationId: string,
  action: string,
  keys: Map<string, string>,
): string {
  const keySlot = `${operationId}:${action}`;
  const storageSlot = storageSlotFor(operationId, action);
  let storedKey = "";
  try { storedKey = `${sessionStorage.getItem(storageSlot) || ""}`.trim(); } catch { /* optional */ }
  const idempotencyKey = keys.get(keySlot)
    || storedKey
    || makeActionKey(operationId, action);
  keys.set(keySlot, idempotencyKey);
  try { sessionStorage.setItem(storageSlot, idempotencyKey); } catch { /* optional */ }
  return idempotencyKey;
}

export function clearAgentOperationActionKey(
  operationId: string,
  action: string,
  keys: Map<string, string>,
): void {
  keys.delete(`${operationId}:${action}`);
  try { sessionStorage.removeItem(storageSlotFor(operationId, action)); } catch { /* optional */ }
}
