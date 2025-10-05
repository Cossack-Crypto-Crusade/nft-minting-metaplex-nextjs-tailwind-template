// hooks/useCandyMachine.ts

import { useEffect, useState, useCallback } from "react";
import { PublicKey } from "@solana/web3.js";
import { fetchCandyMachine, CandyMachine } from "@metaplex-foundation/mpl-candy-machine";
import { Umi } from "@metaplex-foundation/umi";  // or wherever Umi comes from in your setup

interface UseCandyMachineResult {
  loading: boolean;
  error: Error | null;
  candyMachine: CandyMachine | null;
  itemsAvailable: number | null;
  itemsRedeemed: number | null;
  itemsRemaining: number | null;
}

/**
 * Hook to fetch a CandyMachine account’s state.
 * @param umi Umi instance/context
 * @param candyMachineId PublicKey (or string) of CandyMachine
 */
export function useCandyMachine(
  umi: Umi | null,
  candyMachineId: PublicKey | string | null
): UseCandyMachineResult {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [candyMachine, setCandyMachine] = useState<CandyMachine | null>(null);

  const [itemsAvailable, setItemsAvailable] = useState<number | null>(null);
  const [itemsRedeemed, setItemsRedeemed] = useState<number | null>(null);
  const [itemsRemaining, setItemsRemaining] = useState<number | null>(null);

  const fetchState = useCallback(async () => {
    if (!umi || !candyMachineId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cm = await fetchCandyMachine(umi, candyMachineId);
      setCandyMachine(cm);

      // The CandyMachine object will have fields:
      //   itemsAvailable, itemsRedeemed, etc.
      const available = Number(cm.itemsAvailable);
      const redeemed = Number(cm.itemsRedeemed);
      const remaining = available - redeemed;

      setItemsAvailable(available);
      setItemsRedeemed(redeemed);
      setItemsRemaining(remaining);

    } catch (err: any) {
      setError(err instanceof Error ? err : new Error(String(err)));
      setCandyMachine(null);
      setItemsAvailable(null);
      setItemsRedeemed(null);
      setItemsRemaining(null);
    } finally {
      setLoading(false);
    }
  }, [umi, candyMachineId]);

  // Fetch initially and whenever dependencies change
  useEffect(() => {
    fetchState();
  }, [fetchState]);

  return {
    loading,
    error,
    candyMachine,
    itemsAvailable,
    itemsRedeemed,
    itemsRemaining,
  };
}
