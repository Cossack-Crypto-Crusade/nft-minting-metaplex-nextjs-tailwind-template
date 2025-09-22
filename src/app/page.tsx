'use client';

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useUmi } from '@/components/providers/UmiProvider';

export default function HomePage() {
  const umi = useUmi();

  return (
    <main className="flex flex-col items-center justify-center h-screen gap-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-gray-800">
        Wallet & UMI Test
      </h1>

      {/* Wallet connect UI */}
      <WalletMultiButton className="!bg-purple-600 !hover:bg-purple-700 !text-white !rounded-xl !px-4 !py-2" />

      {/* Debug info */}
      <div className="p-4 bg-white rounded-xl shadow-md w-80 text-center">
        <p className="text-sm text-gray-600">
          <strong>Network:</strong> {process.env.NEXT_PUBLIC_SOLANA_NETWORK}
        </p>
        <p className="text-sm text-gray-600 mt-2 break-all">
          <strong>Identity:</strong>{' '}
          {umi.identity?.publicKey?.toString() || 'Not connected'}
        </p>
      </div>
    </main>
  );
}
