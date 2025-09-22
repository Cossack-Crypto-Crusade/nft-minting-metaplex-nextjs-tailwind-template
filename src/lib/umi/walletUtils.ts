// src/lib/umi/walletUtils.ts
import { createNoopSigner, publicKey, signerIdentity } from "@metaplex-foundation/umi";
import { WalletContextState } from "@solana/wallet-adapter-react";
import { walletAdapterIdentity } from "@metaplex-foundation/umi-signer-wallet-adapters";

/**
 * Returns the correct Umi identity plugin for a given wallet state.
 *
 * - If a wallet is connected → uses `walletAdapterIdentity`.
 * - If no wallet is connected → falls back to a NoopSigner with a default public key.
 */
export function safeUmiIdentity(wallet: WalletContextState) {
  if (wallet?.connected && wallet.publicKey) {
    return walletAdapterIdentity(wallet);
  }

  const dummySigner = createNoopSigner(publicKey("11111111111111111111111111111111"));
  return signerIdentity(dummySigner);
}
