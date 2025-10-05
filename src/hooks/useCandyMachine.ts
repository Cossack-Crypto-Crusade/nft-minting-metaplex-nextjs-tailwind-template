// src/hooks/useCandyMachine.ts
import { useEffect, useState } from 'react'
import useUmiStore from '@/store/useUmiStore'
import { publicKey } from '@metaplex-foundation/umi/serializers' // if needed

type CMState = {
  itemsAvailable?: number
  itemsMinted?: number
  itemsRemaining?: number
  goLiveDate?: number | null
  loading: boolean
  error?: string
}

const CANDY_MACHINE_ID = process.env.NEXT_PUBLIC_CANDY_MACHINE_ID // ensure set

export default function useCandyMachine() {
  const umi = useUmiStore().umi
  const [state, setState] = useState<CMState>({ loading: true })

  useEffect(() => {
    let mounted = true
    if (!umi) {
      setState({ loading: false, error: 'Umi not initialized' })
      return
    }
    if (!CANDY_MACHINE_ID) {
      setState({ loading: false, error: 'CANDY_MACHINE_ID not set' })
      return
    }

    const fetchState = async () => {
      try {
        // Replace this with the exact read mechanism for your candy machine version.
        // Example: read account data via umi.rpc.getAccount or use metaplex client.
        const account = await umi.rpc.getAccount(publicKey(CANDY_MACHINE_ID))
        // parse the account.data -> extract itemsAvailable/itemsMinted
        // The parsing depends on candy machine version: adapt to deserializer
        const itemsAvailable = Number(/* parse from account.data */ 0)
        const itemsMinted = Number(/* parse from account.data */ 0)
        const itemsRemaining = itemsAvailable - itemsMinted

        if (mounted) {
          setState({ loading: false, itemsAvailable, itemsMinted, itemsRemaining })
        }
      } catch (err: any) {
        if (mounted) setState({ loading: false, error: String(err) })
      }
    }

    fetchState()
    const interval = setInterval(fetchState, 10_000) // refresh every 10s

    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [umi])

  return state
}
