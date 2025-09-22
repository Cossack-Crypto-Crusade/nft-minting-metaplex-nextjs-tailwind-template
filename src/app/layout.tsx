import './globals.css';
import { WalletProvider } from '@/components/providers/WalletProvider';
import { UmiProvider } from '@/components/providers/UmiProvider';

export const metadata = {
  title: 'NFT Minting Template',
  description: 'Mint NFTs with UMI + Next.js + Tailwind',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <WalletProvider>
          <UmiProvider>
            {children}
          </UmiProvider>
        </WalletProvider>
      </body>
    </html>
  );
}
