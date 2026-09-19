'use client';

import React, { useState, useEffect } from 'react';

interface StoreItem {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  promoPrice: number;
  stock: number;
  cutoff: number;
  image: string;
  video?: string;
  style: string;
}

export default function NexusStorefront() {
  const [toys, setToys] = useState<StoreItem[]>([]);
  const [apparel, setApparel] = useState<StoreItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchInventory = async () => {
      try {
        const res = await fetch('http://localhost:4030/api/storefront/master');
        const data = await res.json();
        setToys(data.toys);
        setApparel(data.apparel);
      } catch (err) {
        console.error(err);
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
  if (loading) return <div className="min-h-screen bg-zinc-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-violet-500"></div></div>;

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-zinc-100">
      
      {/* SECTION A: TOYS & NOVELTIES (DYNAMIC FBA / VIDEO) */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Toys & Novelties Vault</h2>
          <p className="text-sm text-blue-500 font-bold uppercase tracking-widest mt-1">Variation A: Omni Video Sync</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {toys.map((item) => (
            <div key={item.id} className="group relative border border-zinc-800 bg-zinc-900 p-5 rounded-lg hover:border-blue-500 transition-all duration-300 flex shadow-xl">
              <div className="relative w-48 h-48 bg-zinc-800 rounded overflow-hidden flex-shrink-0">
                <img src={item.image} alt={item.name} className="absolute inset-0 w-full h-full object-cover z-10 transition-opacity duration-500 group-hover:opacity-0" />
                <video src={item.video} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
                <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest rounded shadow-md z-20">FBA READY</div>
              </div>
              <div className="ml-6 flex flex-col flex-grow justify-between py-2">
                <div>
                  <h3 className="font-bold text-xl leading-snug text-zinc-100">{item.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{item.description}</p>
                </div>
                <div>
                  <div className="flex items-baseline gap-3 mb-4">
                    <span className="text-2xl font-black text-blue-400">${item.promoPrice.toFixed(2)}</span>
                    <span className="text-sm text-zinc-500 line-through font-mono">${item.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden mb-2">
                    <div className={`h-full rounded-full ${item.stock <= 2 ? 'bg-red-500 animate-pulse' : 'bg-blue-500'}`} style={{ width: `${Math.min((item.stock / 10) * 100, 100)}%` }} />
                  </div>
                  <button className="w-full bg-zinc-100 text-zinc-950 font-black uppercase py-2.5 rounded hover:bg-white transition-all text-sm shadow-lg text-black hover:text-black">1-Click Secure</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION B: APPAREL (PREMIUM LIFESTYLE) */}
      <section className="w-full max-w-7xl mx-auto px-4 pt-8 pb-16">
        <div className="mb-8 border-b border-zinc-800 pb-4">
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">Apparel Hub</h2>
          <p className="text-sm text-violet-500 font-bold uppercase tracking-widest mt-1">Variation B: Premium Lifestyle</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {apparel.map((item) => (
            <div key={item.id} className="group relative border border-transparent hover:border-zinc-800 p-2 rounded-xl transition-all duration-500">
              <div className="relative w-full h-80 bg-zinc-900 rounded-lg mb-6 overflow-hidden shadow-2xl">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent">
                  <div className="bg-zinc-950/80 backdrop-blur-sm px-3 py-1.5 rounded inline-block text-xs font-mono font-bold text-violet-400 border border-violet-900/30">
                    Ships in {formatTime(item.cutoff)}
                  </div>
                </div>
              </div>
              <div className="px-2">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-2xl tracking-tight text-zinc-100">{item.name}</h3>
                  <span className="text-xl font-medium text-white">${item.promoPrice.toFixed(2)}</span>
                </div>
                <p className="text-sm text-zinc-400 mb-6">{item.description}</p>
                <button className="w-full border border-zinc-700 text-white font-bold uppercase py-3.5 rounded hover:bg-white hover:text-black transition-all tracking-widest text-sm">Select Size</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
