'use client';

import React, { useState, useEffect } from 'react';

// ALBS ENTERPRISES - NEXUS FRONTEND - AUTHORIZED LOCAL BUILD
// DOMAIN: STOREFRONT 1 (SNEAKER & FOOTWEAR VAULT)
// CONSTRAINT: 6-ITEM SPOKE-WHEEL HARDCAP

interface SneakerItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  cutoff: number;
}

export default function SneakerVaultStorefront() {
  const [inventory, setInventory] = useState<SneakerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/storefront/Sneaker_&_Footwear_Vault');
        if (!res.ok) throw new Error('AirBridge Gateway offline');
        const data = await res.json();
        
        // ENFORCE SPOKE-WHEEL HARDCAP: STRICT 6 ITEMS
        setInventory(data.slice(0, 6));
      } catch (err) {
        setError('AirBridge Gateway synchronization failed. Retrying connection...');
      } finally {
        setLoading(false);
      }
    };

    fetchInventory();
  }, []);

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (!mounted) return null; 

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="mb-8 border-b border-zinc-800 pb-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          Sneaker & Footwear Vault
        </h2>
        <p className="text-sm text-red-500 font-bold uppercase tracking-widest mt-1 animate-pulse">
          Active Drops — Live Gateway Sync
        </p>
      </div>

      {loading ? (
         <div className="w-full py-24 flex flex-col items-center justify-center border border-zinc-800 rounded bg-zinc-900/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500 mb-6"></div>
            <p className="text-zinc-400 uppercase tracking-widest text-sm font-mono text-center leading-relaxed">
              Awaiting AirBridge Gateway sync... <br/>
              Scanning vault for exclusive sneaker drops and high-heat footwear.
            </p>
         </div>
      ) : error ? (
        <div className="p-5 bg-red-950/20 border border-red-500/50 text-red-400 rounded font-mono text-sm tracking-wide">
          [SYSTEM ERROR]: {error}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {inventory.map((item) => (
            <div 
              key={item.id} 
              className="group relative border border-zinc-800 bg-zinc-900 p-5 rounded-lg hover:border-red-500 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="w-full h-52 bg-zinc-800 rounded mb-4 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent z-10" />
                  <span className="text-zinc-600 font-mono text-xs uppercase z-20">Footwear_Asset_{item.id}</span>
                </div>

                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg leading-snug text-zinc-100 pr-2">{item.name}</h3>
                  <span className="text-xl font-black text-white whitespace-nowrap">${item.price}</span>
                </div>

                <div className="mt-4" aria-label={`Only ${item.stock} pairs remaining`}>
                  <div className="flex justify-between text-xs mb-1 font-mono uppercase tracking-wider">
                    <span className="text-zinc-400">Vault Inventory</span>
                    <span className={item.stock <= 2 ? 'text-red-500 font-bold' : 'text-amber-500'}>
                      {item.stock} Left
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${item.stock <= 2 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-amber-500'}`} 
                      style={{ width: `${Math.min((item.stock / 10) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-5 border-t border-zinc-800">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">
                    Amistad Express
                  </span>
                  <div className="bg-zinc-950 px-3 py-1.5 rounded text-xs font-mono font-bold text-red-400 border border-red-900/30">
                    {`Ships in ${formatTime(item.cutoff)}`}
                  </div>
                </div>
                <button className="w-full bg-zinc-100 text-zinc-950 font-black uppercase py-3.5 rounded hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all tracking-widest shadow-lg">
                  Claim Asset
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
