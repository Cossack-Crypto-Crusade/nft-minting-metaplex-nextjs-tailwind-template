import React, { useState } from "react";
import useCandyMachine from "@/hooks/useCandyMachine";
import useUmiStore from "@/store/useUmiStore";
import { TransactionBuilder } from "@metaplex-foundation/umi";
import sendAndConfirmWithWalletAdapter from "@/lib/umi/sendAndConfirmWithWalletAdapter";
import toast from "react-hot-toast";

// Helper for better error messages
function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

export default function MintButton() {
  const { itemsRemaining } = useCandyMachine();
  const [loading, setLoading] = useState(false);
  const umi = useUmiStore().umi;

  const handleMint = async () => {
    if (!umi) {
      toast.error("Wallet not connected.");
      return;
    }
    setLoading(true);
    try {
      const tx = new TransactionBuilder();
      // TODO: add mint instruction here (e.g. candy machine mint instruction)
      // Call the helper with (tx, opts) — matches the 1-2 arg signature.
      const sig = await sendAndConfirmWithWalletAdapter(tx, {
        commitment: "confirmed",
      });

      toast.success(`Mint succeeded! ✅ Transaction: ${sig}`, { duration: 6000 });
      console.log("Mint succeeded:", sig);
    } catch (err: unknown) {
      const msg = getErrorMessage(err);
      console.error("Mint error:", err);
      toast.error(`Mint failed: ${msg}`);
    } finally {
      setLoading(false);
    }
  };

  const soldOut = itemsRemaining !== undefined && itemsRemaining <= 0;

  return (
    <button
      className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 disabled:opacity-50"
      onClick={handleMint}
      disabled={loading || soldOut}
    >
      {soldOut ? "Sold Out" : loading ? "Minting…" : "Mint"}
    </button>
  );
}
