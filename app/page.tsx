'use client';
import { useEffect, useState } from 'react';
import { TonConnectUIProvider, TonConnectButton } from '@tonconnect/ui-react';
import CoinScene from '@/components/CoinScene';
import axios from 'axios';

// Replace with your Manifest URL (hosted JSON file)
const MANIFEST_URL = 'https://your-app-url.vercel.app/tonconnect-manifest.json';

export default function Home() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 1. Authenticate on Load
  useEffect(() => {
    const initAuth = async () => {
      if (typeof window !== 'undefined' && (window as any).Telegram?.WebApp) {
        const tg = (window as any).Telegram.WebApp;
        tg.ready();
        tg.expand();

        try {
          // Send initData to backend for verification
          const res = await axios.post('/api/auth', { initData: tg.initData });
          setUser(res.data.user);
        } catch (error) {
          console.error("Auth failed");
        } finally {
          setLoading(false);
        }
      }
    };
    initAuth();
  }, []);

  // 2. Handle Tapping
  const handleTap = async () => {
    if (!user) return;
    
    // Optimistic UI update (update screen immediately)
    setUser((prev: any) => ({ ...prev, coins: prev.coins + 1 }));

    // Sync with backend (debounce this in production to save server load)
    // await axios.post('/api/tap', { telegramId: user.telegramId });
  };

  // 3. Task: Verify Telegram Channel Join
  const verifyTelegramTask = async () => {
    // In a real app, you call an API that checks `getChatMember` using your Bot Token
    alert("Checking if you joined the channel...");
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-white">Loading Lion...</div>;

  return (
    <TonConnectUIProvider manifestUrl={MANIFEST_URL}>
      <main className="flex min-h-screen flex-col items-center bg-gray-900 text-white p-4">
        
        {/* Header: Wallet & User Info */}
        <div className="w-full flex justify-between items-center mb-8">
          <div className="text-sm font-bold text-yellow-400">
             🦁 {user?.firstName}
          </div>
          <TonConnectButton />
        </div>

        {/* Score */}
        <div className="text-5xl font-black mb-4 select-none">
          {user?.coins.toLocaleString()}
        </div>
        <div className="text-gray-400 text-sm mb-8">LEO COINS</div>

        {/* 3D Scene */}
        <CoinScene onTap={handleTap} />

        {/* Tasks Section */}
        <div className="w-full max-w-md mt-8 bg-gray-800 rounded-xl p-4">
          <h3 className="text-lg font-bold mb-4">Earn More</h3>
          
          <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg mb-2">
            <div>
              <div className="font-bold">Join Telegram</div>
              <div className="text-xs text-yellow-400">+5,000 LEO</div>
            </div>
            <button onClick={verifyTelegramTask} className="bg-blue-500 px-4 py-1 rounded text-sm">
              Check
            </button>
          </div>

          <div className="flex justify-between items-center bg-gray-700 p-3 rounded-lg">
            <div>
              <div className="font-bold">Watch YouTube</div>
              <div className="text-xs text-yellow-400">+10,000 LEO</div>
            </div>
            <button className="bg-red-500 px-4 py-1 rounded text-sm">
              Watch
            </button>
          </div>
        </div>

      </main>
    </TonConnectUIProvider>
  );
}