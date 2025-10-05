import React from "react";
import { useCandyMachine } from "../hooks/useCandyMachine";
import { useUmi } from "../context/umi";  // hypothetical hook to get Umi instance
import { PublicKey } from "@solana/web3.js";

export function CandyMachineStatus({ cmId }: { cmId: string }) {
  const umi = useUmi();
  const { loading, error, itemsAvailable, itemsRedeemed, itemsRemaining } = useCandyMachine(
    umi,
    new PublicKey(cmId)
  );

  if (loading) {
    return <div>Loading candy machine data…</div>;
  }
  if (error) {
    return <div>Error loading: {error.message}</div>;
  }
  if (itemsAvailable === null || itemsRedeemed === null) {
    return <div>No data</div>;
  }
  return (
    <div>
      <p>Total Available: {itemsAvailable}</p>
      <p>Already Minted: {itemsRedeemed}</p>
      <p>Remaining: {itemsRemaining}</p>
    </div>
  );
}
