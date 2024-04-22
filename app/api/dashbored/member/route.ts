import { NextResponse } from 'next/server';
import { connectMongoDB } from '@/lib/mongodb'; 
import Member from '@/models/member'; // 모델 경로 확인

export async function GET() {
  await connectMongoDB();

    const results = await Member.find();
    return NextResponse.json(results);
  }