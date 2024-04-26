import { connectMongoDB } from "@/lib/mongodb";
import Corporation from "@/models/corporation"; // Corporation 모델의 경로를 확인하세요
import { NextResponse,NextRequest } from "next/server";
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

export async function GET(request : NextRequest) {
  console.log("이건가",request.url)

  const paths = request.url.split('/'); 
  const id = paths[paths.length - 1];

  await connectMongoDB();
    const results = await Corporation.findOne({_id: new ObjectId(`${id}`)});
    
   
    return NextResponse.json(results)
  }