/**
 * Pi Network SDK Service
 *
 * Wraps the Pi Network JavaScript SDK that is injected by the Pi Browser.
 * When the app runs outside the Pi Browser the SDK will not be available
 * and all operations gracefully degrade (auth returns null, payments are
 * rejected with a clear error message).
 *
 * Official docs: https://pi-apps.github.io/pi-platform-docs/
 */

import { PiUser, PiPaymentCallbacks } from '../types.ts';

// ---------------------------------------------------------------------------
// Global type augmentation – the Pi Browser injects a `Pi` global.
// ---------------------------------------------------------------------------
interface PiScope {
  init: (config: { version: string; sandbox?: boolean }) => void;
  authenticate: (
    scopes: string[],
    onIncompletePaymentFound: (payment: unknown) => void
  ) => Promise<{ accessToken: string; user: { uid: string; username: string } }>;
  createPayment: (
    paymentData: { amount: number; memo: string; metadata: Record<string, unknown> },
    callbacks: PiPaymentCallbacks
  ) => void;
}

declare global {
  interface Window {
    Pi?: PiScope;
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Returns `true` when running inside the Pi Browser (SDK is present). */
export const isPiBrowser = (): boolean => typeof window !== 'undefined' && typeof window.Pi !== 'undefined';

// ---------------------------------------------------------------------------
// Initialisation
// ---------------------------------------------------------------------------

/**
 * Initialise the Pi SDK. Should be called once at application start-up.
 * `sandbox` can be set to `true` during development on the Pi Sandbox.
 */
export const initPiNetwork = (sandbox = false): void => {
  if (!isPiBrowser()) {
    console.warn('[PiNet] Pi SDK not detected – running outside Pi Browser.');
    return;
  }
  window.Pi!.init({ version: '2.0', sandbox });
  console.info('[PiNet] Pi SDK initialised (sandbox:', sandbox, ')');
};

// ---------------------------------------------------------------------------
// Authentication
// ---------------------------------------------------------------------------

/**
 * Authenticate the current Pi user.
 *
 * Returns the authenticated user object or `null` when running outside the
 * Pi Browser.
 */
export const authenticatePiUser = async (): Promise<{
  accessToken: string;
  user: PiUser;
} | null> => {
  if (!isPiBrowser()) {
    console.warn('[PiNet] Cannot authenticate – Pi SDK not available.');
    return null;
  }

  try {
    const authResult = await window.Pi!.authenticate(
      ['username', 'payments'],
      (incompletePayment) => {
        // Handle incomplete payments found during auth
        console.info('[PiNet] Incomplete payment found during auth:', incompletePayment);
      }
    );

    return {
      accessToken: authResult.accessToken,
      user: {
        uid: authResult.user.uid,
        username: authResult.user.username,
      },
    };
  } catch (error) {
    console.error('[PiNet] Authentication failed:', error);
    return null;
  }
};

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

/**
 * Initiate a Pi payment from the user to the app.
 *
 * In a full production deployment the `onReadyForServerApproval` and
 * `onReadyForServerCompletion` callbacks would call your backend to
 * record and verify the payment via the Pi Platform API.  For this
 * client-only DApp they log to the console and invoke the callbacks
 * directly so the flow completes.
 */
export const createPiPayment = (
  amount: number,
  memo: string,
  metadata: Record<string, unknown> = {}
): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isPiBrowser()) {
      reject(new Error('Pi SDK not available – payments require the Pi Browser.'));
      return;
    }

    window.Pi!.createPayment(
      { amount, memo, metadata },
      {
        onReadyForServerApproval: (paymentId: string) => {
          // In production: POST paymentId to your server for approval
          console.info('[PiNet] Payment ready for server approval:', paymentId);
        },
        onReadyForServerCompletion: (paymentId: string, txid: string) => {
          // In production: POST paymentId + txid to your server for completion
          console.info('[PiNet] Payment completed – txid:', txid);
          resolve(paymentId);
        },
        onCancel: (paymentId: string) => {
          console.info('[PiNet] Payment cancelled:', paymentId);
          reject(new Error('Payment was cancelled by the user.'));
        },
        onError: (error: Error) => {
          console.error('[PiNet] Payment error:', error);
          reject(error);
        },
      }
    );
  });
};
