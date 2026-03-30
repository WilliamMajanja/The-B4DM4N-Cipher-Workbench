/**
 * Minima MDS (MiniDApp System) Service
 *
 * Wraps the Minima MDS JavaScript API that is available when running as a
 * MiniDApp inside a Minima node.  When the app runs outside a Minima node
 * the MDS global will not be present and all operations gracefully degrade
 * (status returns null, payments are rejected with a clear error message).
 *
 * Official docs: https://docs.minima.global/docs/development/minidapps
 */

import { MinimaUser, MinimaBalance } from '../types.ts';

// ---------------------------------------------------------------------------
// Global type augmentation – Minima nodes expose an `MDS` global.
// ---------------------------------------------------------------------------
interface MDSResponse {
  status: boolean;
  response?: Record<string, unknown>;
  error?: string;
}

interface MDSScope {
  init: (callback: (msg: { event: string; data?: Record<string, unknown> }) => void) => void;
  cmd: (command: string, callback?: (res: MDSResponse) => void) => void;
  sql: (query: string, callback?: (res: MDSResponse) => void) => void;
  log: (message: string) => void;
  notify: (message: string) => void;
  minidappuid?: string;
}

declare global {
  interface Window {
    MDS?: MDSScope;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns `true` when the MDS API is available (running inside a Minima node). */
export const isMinimaNode = (): boolean =>
  typeof window !== 'undefined' && typeof window.MDS !== 'undefined';

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

/**
 * Initialise the MDS connection.  Should be called once at application
 * start-up.  The provided callback is invoked for every MDS event
 * (e.g. `inited`, `NEWBALANCE`, `NEWBLOCK`).
 */
export const initMinima = (
  onEvent: (event: string, data?: Record<string, unknown>) => void
): void => {
  if (!isMinimaNode()) {
    console.warn('[Minima] MDS not detected – running outside a Minima node.');
    return;
  }

  window.MDS!.init((msg) => {
    onEvent(msg.event, msg.data);
  });
  console.info('[Minima] MDS initialised');
};

// ---------------------------------------------------------------------------
// Node status / user identity
// ---------------------------------------------------------------------------

/**
 * Retrieve the current Minima node status.
 *
 * Returns a simplified user object with the node's public key, or `null`
 * when running outside a Minima node.
 */
export const getMinimaStatus = (): Promise<MinimaUser | null> => {
  return new Promise((resolve) => {
    if (!isMinimaNode()) {
      console.warn('[Minima] Cannot get status – MDS not available.');
      resolve(null);
      return;
    }

    window.MDS!.cmd('status', (res: MDSResponse) => {
      if (res.status && res.response) {
        const resp = res.response as Record<string, unknown>;
        resolve({
          publicKey: (resp.publickey as string) ?? 'unknown',
          version: (resp.version as string) ?? '',
        });
      } else {
        console.error('[Minima] Status command failed:', res.error);
        resolve(null);
      }
    });
  });
};

// ---------------------------------------------------------------------------
// Balance
// ---------------------------------------------------------------------------

/**
 * Retrieve the Minima token balance for the node.
 */
export const getMinimaBalance = (): Promise<MinimaBalance[]> => {
  return new Promise((resolve) => {
    if (!isMinimaNode()) {
      resolve([]);
      return;
    }

    window.MDS!.cmd('balance', (res: MDSResponse) => {
      if (res.status && res.response) {
        const balances = res.response as unknown as Array<{
          token: string;
          tokenid: string;
          confirmed: string;
          sendable: string;
        }>;
        resolve(
          (Array.isArray(balances) ? balances : []).map((b) => ({
            token: b.token,
            tokenid: b.tokenid,
            confirmed: b.confirmed,
            sendable: b.sendable,
          }))
        );
      } else {
        resolve([]);
      }
    });
  });
};

// ---------------------------------------------------------------------------
// Payments / Sending Minima
// ---------------------------------------------------------------------------

/**
 * Send Minima tokens to a given address.
 *
 * Returns the transaction ID on success.  Rejects when MDS is unavailable
 * or when the send command fails.
 */
export const sendMinima = (
  amount: number,
  address: string,
  tokenid = '0x00'
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isMinimaNode()) {
      reject(new Error('MDS not available – transactions require a running Minima node.'));
      return;
    }

    const cmd = `send amount:${amount} address:${address} tokenid:${tokenid}`;
    window.MDS!.cmd(cmd, (res: MDSResponse) => {
      if (res.status && res.response) {
        const txId = String(
          (res.response as Record<string, unknown>).txpowid ?? 'pending'
        );
        console.info('[Minima] Transaction sent – txpowid:', txId);
        resolve(txId);
      } else {
        const errMsg = res.error ?? 'Transaction failed.';
        console.error('[Minima] Send failed:', errMsg);
        reject(new Error(errMsg));
      }
    });
  });
};
