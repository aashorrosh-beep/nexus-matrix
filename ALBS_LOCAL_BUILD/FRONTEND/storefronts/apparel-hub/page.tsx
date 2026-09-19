'use client';

import React, { useState, useEffect } from 'react';

// ALBS ENTERPRISES - NEXUS FRONTEND - AUTHORIZED LOCAL BUILD
// DOMAIN: STOREFRONT 2 (APPAREL & STREETWEAR HUB)
// CONSTRAINT: 5-ITEM SPOKE-WHEEL HARDCAP

interface ApparelItem {
  id: string;
  name: string;
  price: number;
  stock: number;
  cutoff: number;
}

export default function ApparelStorefront() {
  const [inventory, setInventory] = useState<ApparelItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/storefront/Apparel_&_Streetwear_Hub');
        if (!res.ok) throw new Error('AirBridge Gateway offline');
        const data = await res.json();
        
        // ENFORCE SPOKE-WHEEL HARDCAP: STRICT 5 ITEMS
        setInventory(data.slice(0, 5));
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
          Apparel & Streetwear Hub
        </h2>
        <p className="text-sm text-stone-300 font-bold uppercase tracking-widest mt-1 animate-pulse">
          Capsule Vault Active — Live Gateway Sync
        </p>
      </div>

      {loading ? (
         <div className="w-full py-24 flex flex-col items-center justify-center border border-zinc-800 rounded bg-zinc-900/50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-stone-300 mb-6"></div>
            <p className="text-zinc-400 uppercase tracking-widest text-sm font-mono text-center leading-relaxed">
              Awaiting AirBridge Gateway sync... <br/>
              Scanning vault for limited streetwear threads and capsule collections.
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
              className="group relative border border-zinc-800 bg-zinc-900 p-5 rounded-lg hover:border-stone-300 transition-all duration-300 flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="w-full h-52 bg-zinc-800 rounded mb-4 flex items-center justify-center overflow-hidden relative">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 to-transparent z-10" />
                  <span className="text-zinc-600 font-mono text-xs uppercase z-20">Garment_Asset_{item.id}</span>
                </div>

                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-bold text-lg leading-snug text-zinc-100 pr-2">{item.name}</h3>
                  <span className="text-xl font-black text-white whitespace-nowrap">${item.price}</span>
                </div>

                <div className="mt-4" aria-label={`Only ${item.stock} pieces remaining`}>
                  <div className="flex justify-between text-xs mb-1 font-mono uppercase tracking-wider">
                    <span className="text-zinc-400">Vault Inventory</span>
                    <span className={item.stock <= 2 ? 'text-red-500 font-bold' : 'text-stone-300'}>
                      {item.stock} Left
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${item.stock <= 2 ? 'bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]' : 'bg-stone-300'}`} 
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
                  <div className="bg-zinc-950 px-3 py-1.5 rounded text-xs font-mono font-bold text-stone-300 border border-stone-800/50">
                    {`Ships in ${formatTime(item.cutoff)}`}
                  </div>
                </div>
                <button className="w-full bg-zinc-100 text-zinc-950 font-black uppercase py-3.5 rounded hover:bg-white hover:scale-[1.02] active:scale-[0.98] transition-all tracking-widest shadow-lg">
                  Secure Garment
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
