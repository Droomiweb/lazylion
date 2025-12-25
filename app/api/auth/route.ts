import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import dbConnect from '@/lib/db';
import User from '@/models/User';

const BOT_TOKEN = process.env.BOT_TOKEN!;

// Verification Logic
const verifyTelegramWebAppData = (telegramInitData: string) => {
  const encoded = decodeURIComponent(telegramInitData);
  const secret = crypto.createHmac('sha256', 'WebAppData').update(BOT_TOKEN).digest();
  const arr = encoded.split('&');
  const hashIndex = arr.findIndex((str) => str.startsWith('hash='));
  const hash = arr.splice(hashIndex, 1)[0].split('=')[1];
  
  // Sort alphabetically
  arr.sort((a, b) => a.localeCompare(b));
  const dataCheckString = arr.join('\n');
  
  const _hash = crypto.createHmac('sha256', secret).update(dataCheckString).digest('hex');
  return _hash === hash;
};

export async function POST(req: NextRequest) {
  await dbConnect();
  const body = await req.json();
  const { initData } = body;

  // 1. Verify Signature
  const isValid = verifyTelegramWebAppData(initData);
  if (!isValid) return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });

  // 2. Parse User Data
  const urlParams = new URLSearchParams(initData);
  const userString = urlParams.get('user');
  if (!userString) return NextResponse.json({ error: 'No user data' }, { status: 400 });
  
  const telegramUser = JSON.parse(userString);

  // 3. Find or Create User in MongoDB
  let user = await User.findOne({ telegramId: telegramUser.id });
  
  if (!user) {
    user = await User.create({
      telegramId: telegramUser.id,
      username: telegramUser.username,
      firstName: telegramUser.first_name,
      coins: 1000, // Welcome bonus
    });
  }

  return NextResponse.json({ user });
}