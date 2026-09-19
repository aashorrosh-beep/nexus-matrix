/* 
 * =====================================================================
 * ALBS ENTERPRISES LLC - PATENT PENDING 
 * PROPRIETARY ARCHITECTURE & DIGITAL ASSET
 * AUTHORIZED NODE FINGERPRINT: b1c37bcac91269c5c6b2f4a2c1bca687d1ff251fa99ae809900777abce6fe1cb 
 * ORIGINATION: 2026-09-11T06:31:00.974Z 
 * =====================================================================
 */

import { NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://127.0.0.1:6379');

export async function GET() {
    try {
        // Fetch the absolute #1 item from the trading cards bucket
        const topItemRaw = await redis.zrevrange('trending:1:cards', 0, 0);
        if (topItemRaw.length > 0) {
            const winner = JSON.parse(topItemRaw[0]);
            return NextResponse.json({ success: true, item: winner });
        }
        return NextResponse.json({ success: false });
    } catch (error) {
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
