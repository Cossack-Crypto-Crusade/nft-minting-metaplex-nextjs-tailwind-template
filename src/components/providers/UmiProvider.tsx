"use client";

import {
  ReactNode,
  useMemo,
  useState,
  useEffect,
  createContext,
  useContext,
} from "react";
import {
  signerIdentity,
  createNoopSigner,
  publicKey,
} from "@metaplex-foundation/umi";
import { createUmi as createUmiWithDefaults } from "@metaplex-foundation/umi-bundle-defaults";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";
import { useWallet } from "@solana/wallet-adapter-react";

/// Type alias for the Umi client instance.
type UmiClientType = ReturnType<typeof createUmiWithDefaults>;

/// React context for exposing the Umi client throughout the app.
const UmiContext = createContext<UmiClientType | null>(null);

/**
 * React hook to consume the Umi client instance.
 * Throws if used outside of `<UmiProvider>`.
 */
export function useUmi() {
  const ctx = useContext(UmiContext);
  if (!ctx) throw new Error("useUmi must be used within UmiProvider");
  return ctx;
}

/**
 * UmiProvider wraps your app with an initialized Umi client.
 *
 * - If a wallet is connected, it uses the wallet’s identity.
 * - If no wallet is connected, it falls back to a NoopSigner identity.
 *   This avoids NullSigner errors.
 *
 * Includes a `mounted` guard to prevent hydration mismatches.
 * Shows a loading spinner while waiting for client mount.
 */
export function UmiProvider({ children }: { children: ReactNode }) {
  const wallet = useWallet();
  const [mounted, setMounted] = useState(false);

  // Ensure we only render on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const umiClient = useMemo(() => {
    const rpcUrl = process.env.NEXT_PUBLIC_RPC_URL;
    if (!rpcUrl) {
      throw new Error(
        "❌ Missing NEXT_PUBLIC_RPC_URL in environment. Please set it in your .env.local file."
      );
    }

    const umi = createUmiWithDefaults(rpcUrl);

    if (wallet?.connected && wallet.publicKey) {
      umi.use(walletAdapterIdentity(wallet));
      console.log(`[UMI] Using wallet identity: ${wallet.publicKey.toBase58()}`);
    } else {
      const dummyPubkey = publicKey("11111111111111111111111111111111");
      const dummySigner = createNoopSigner(dummyPubkey);
      umi.use(signerIdentity(dummySigner));
      console.log("[UMI] Using noop/dummy identity");
    }

    return umi;
  }, [wallet?.connected, wallet?.publicKey]);

  if (!mounted) {
    // Tailwind spinner fallback
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-black text-white">
        <div className="flex flex-col items-center space-y-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent" />
          <span className="text-sm opacity-70">Loading Umi Client…</span>
        </div>
      </div>
    );
  }

  return <UmiContext.Provider value={umiClient}>{children}</UmiContext.Provider>;
}
