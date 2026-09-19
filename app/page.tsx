
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Clock, ShieldCheck, Zap, Truck, CheckCircle, X, Lock } from 'lucide-react';

export default function DigitalStorefront() {
  const [timeLeft, setTimeLeft] = useState('23:59:59');
  const [inventory, setInventory] = useState<any[]>([]);
  const [status, setStatus] = useState('LOADING VAULT...');
  const [activeStore, setActiveStore] = useState('trading_cards_vault');
  const [checkoutItem, setCheckoutItem] = useState<any>(null); // The Secure Checkout Gateway

  // ALBS 13 Rooms Master Array
  const stores = [
    "sneaker_footwear_vault", "apparel_streetwear_hub", "toys_games_novelties",
    "tech_mobile_gear", "beauty_self_care_lab", "health_wellness_bar",
    "home_lifestyle_living", "fitness_recovery_core", "pet_lifestyle_bar",
    "kitchen_smart_gadgets", "travel_edc_essentials", "curated_mystery_boxes",
    "trading_cards_vault"
  ];

  useEffect(() => {
    setStatus(`LOADING ${activeStore.toUpperCase()}...`);
    fetch(`/${activeStore}.json')
      .then(res => res.json())
      .then(data => {
        if (data.items) {
          setInventory(data.items);
          setStatus('LIVE');
        } else {
          setInventory([]);
          setStatus('AWAITING FORGE SYNC');
        }
      })
      .catch(err => {
        setInventory([]);
        setStatus('COMMUNICATION ERROR WITH FORGE');
      });
  }, [activeStore]);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const tomorrow = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
      const diff = tomorrow.getTime() - now.getTime();
      const h = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft(`${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20 relative">
      <header className="bg-black text-white p-4 sticky top-0 z-40 flex justify-between items-center shadow-2xl">
        <div className="flex items-center">
          <Zap className="w-5 h-5 text-yellow-400 mr-2" />
          <h1 className="font-black tracking-tighter text-xl mr-6">ALBS ENTERPRISES</h1>
          <div className="hidden md:flex items-center bg-green-900/50 text-green-400 px-3 py-1 rounded-full text-xs font-bold border border-green-500/30">
            <ShieldCheck className="w-4 h-4 mr-1" />
            CERTIFIED APPROVED VENDOR
          </div>
        </div>
        <div className="flex items-center bg-red-600 px-3 py-1 rounded text-sm font-bold animate-pulse">
          <Clock className="w-4 h-4 mr-2" />
          {timeLeft}
        </div>
      </header>

      <div className="bg-yellow-400 text-black font-bold text-xs py-2 overflow-hidden whitespace-nowrap">
        <div className="inline-block animate-[marquee_20s_linear_infinite]">
          🔥 VIRAL ALERT: High-Velocity Dropship Engine Active --- ⚡ STRICT ALBS SLA: All items dispatch in 3-7 days.
        </div>
      </div>

      <div className="bg-white border-b border-slate-200 overflow-x-auto whitespace-nowrap px-4 py-3 flex gap-4 shadow-sm scrollbar-hide">
        {stores.map((store) => (
          <button 
            key={store}
            onClick={() => setActiveStore(store)}
            className={`px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-colors flex-shrink-0 ${
              activeStore === store ? 'bg-black text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {store.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      <div className="max-w-5xl mx-auto mt-8 px-4 grid gap-6">
        <div className="text-center font-mono text-xs text-slate-400 mb-2">SYSTEM STATUS: {status}</div>
        
        {inventory?.map((item, index) => (
          <motion.div 
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-4 rounded-xl shadow-lg border border-slate-100 flex flex-col md:flex-row gap-6 items-center hover:shadow-xl transition-shadow"
          >
            <div className="w-full md:w-64 h-64 bg-slate-100 rounded-lg relative overflow-hidden flex-shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover absolute top-0 left-0" />
              <span className="absolute top-3 left-3 bg-black text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest z-10 shadow-md">
                {item.tag}
              </span>
            </div>

            <div className="flex-1 w-full flex flex-col h-full justify-center">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Verified Authentic</span>
                </div>
                <h2 className="text-2xl font-black mb-1 leading-tight">{item.name}</h2>
                <p className="text-red-600 font-bold text-sm mb-4 flex items-center">
                  <span className="w-2 h-2 rounded-full bg-red-600 mr-2 animate-ping"></span>
                  Stock: {item.stock} - Selling Fast
                </p>
                <div className="bg-slate-50 border border-slate-100 rounded p-3 mb-6 flex items-center">
                  <Truck className="w-5 h-5 text-slate-400 mr-3" />
                  <div>
                    <div className="text-sm font-bold text-slate-700">Dropship Dispatch Protocol</div>
                    <div className="text-xs text-slate-500">Guaranteed fulfillment within 3 to 7 business days.</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <span className="text-4xl font-black tracking-tighter">${item.price.toFixed(2)}</span>
                <button 
                  onClick={() => setCheckoutItem(item)}
                  className="bg-black hover:bg-slate-800 text-white font-bold py-4 px-8 rounded-lg flex items-center transition-colors active:scale-95 shadow-xl hover:shadow-2xl"
                >
                  <ShoppingBag className="w-5 h-5 mr-2" />
                  SECURE NOW
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ALBS SECURE CHECKOUT OVERLAY (THE LOCK) */}
      <AnimatePresence>
        {checkoutItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-200"
            >
              <div className="bg-slate-900 p-4 flex justify-between items-center text-white">
                <div className="flex items-center font-bold tracking-widest text-sm">
                  <Lock className="w-4 h-4 mr-2 text-green-400" />
                  SECURE ENCRYPTED CHECKOUT
                </div>
                <button onClick={() => setCheckoutItem(null)} className="hover:bg-slate-700 p-1 rounded transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100">
                  <img src={checkoutItem.image} alt="Product" className="w-20 h-20 rounded-lg object-cover shadow-sm" />
                  <div>
                    <h3 className="font-black text-lg leading-tight">{checkoutItem.name}</h3>
                    <div className="text-sm font-bold text-green-600 flex items-center mt-1">
                      <CheckCircle className="w-3 h-3 mr-1" /> ALBS Certified Supply
                    </div>
                  </div>
                </div>
                <div className="space-y-3 mb-8">
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Subtotal</span>
                    <span>${checkoutItem.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-medium text-slate-500">
                    <span>Expedited Shipping (3-7 Days)</span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="flex justify-between text-xl font-black text-black pt-3 border-t border-slate-100">
                    <span>Total Due</span>
                    <span>${checkoutItem.price.toFixed(2)}</span>
                  </div>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-transform active:scale-95 flex items-center justify-center">
                  <Lock className="w-5 h-5 mr-2" />
                  PROCEED TO PAYMENT
                </button>
                <div className="text-center mt-4 flex items-center justify-center gap-2 text-xs text-slate-400 font-medium">
                  <ShieldCheck className="w-4 h-4" /> Transactions secured by Stripe 256-bit encryption
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `@keyframes marquee { 0% { transform: translateX(100%); } 100% { transform: translateX(-100%); } }`}} />
    </main>
  );
}
