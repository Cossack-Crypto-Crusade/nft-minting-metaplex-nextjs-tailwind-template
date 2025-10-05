"use client";

import React from "react";
import useCandyMachine from "@/hooks/useCandyMachine";
import useUmiStore from "@/store/useUmiStore";

type Props = {
  candyMachineId: string;
};

export default function CandyMachineStatus({ candyMachineId }: Props) {
  // Grab umi from the Zustand store
  const umi = useUmiStore((state) => state.umi);

  const {
    itemsAvailable,
    itemsMinted,
    itemsRemaining,
    loading,
    error,
    refresh,
  } = useCandyMachine(umi, candyMachineId, { pollIntervalMs: 15000 });

  if (loading) {
    return (
      <div className="p-4 rounded-2xl shadow bg-white text-gray-500">
        Loading candy machine…
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-2xl shadow bg-white text-red-600">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white space-y-2">
      <h2 className="text-xl font-bold">Candy Machine Status</h2>
      <div className="flex flex-col space-y-1 text-gray-800">
        <span>Available: {itemsAvailable ?? "—"}</span>
        <span>Minted: {itemsMinted ?? "—"}</span>
        <span>Remaining: {itemsRemaining ?? "—"}</span>
      </div>
      <button
        onClick={refresh}
        className="px-3 py-1 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
      >
        Refresh
      </button>
    </div>
  );
}
