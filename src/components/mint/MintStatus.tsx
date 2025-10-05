// src/components/mint/MintStatus.tsx
import React from 'react'
import useCandyMachine from '@/hooks/useCandyMachine' // implement below

export default function MintStatus() {
  const { itemsAvailable, itemsMinted, itemsRemaining, loading } = useCandyMachine()

  if (loading) {
    return (
      <div className="p-4 rounded-2xl shadow-md bg-white/5">
        <div>Loading mint status…</div>
      </div>
    )
  }

  return (
    <div className="p-4 rounded-2xl shadow-md bg-white/5">
      <h3 className="text-lg font-semibold mb-2">Mint Status</h3>
      <div className="grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className="text-sm">Total</div>
          <div className="text-xl font-bold">{itemsAvailable ?? '—'}</div>
        </div>
        <div className="text-center">
          <div className="text-sm">Minted</div>
          <div className="text-xl font-bold">{itemsMinted ?? '—'}</div>
        </div>
        <div className="text-center">
          <div className="text-sm">Remaining</div>
          <div className="text-xl font-bold">{itemsRemaining ?? '—'}</div>
        </div>
      </div>
    </div>
  )
}
