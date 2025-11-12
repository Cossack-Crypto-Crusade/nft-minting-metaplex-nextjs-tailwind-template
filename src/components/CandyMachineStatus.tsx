import React, { useMemo } from "react";
import { PublicKey } from "@solana/web3.js";
import { useCandyMachine } from "../hooks/useCandyMachine";
import { useUmi } from "./providers/UmiProvider";

export function CandyMachineStatus({ cmId }: { cmId: string }) {
  const umi = useUmi();

  const candyMachinePublicKey = useMemo(() => {
    if (!cmId) {
      return null;
    }
    try {
      return new PublicKey(cmId);
    } catch (err) {
      console.warn("[CandyMachineStatus] Invalid candy machine id", err);
      return null;
    }
  }, [cmId]);

  const { loading, error, itemsAvailable, itemsRedeemed, itemsRemaining } = useCandyMachine(
    umi,
    candyMachinePublicKey
  );

  if (!cmId) {
    return <div>Please provide a Candy Machine address to display its status.</div>;
  }

  if (!candyMachinePublicKey) {
    return <div>Invalid Candy Machine address. Double-check the configured public key.</div>;
  }

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
