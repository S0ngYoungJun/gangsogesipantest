// pages/api/registerCorporation.js
import { connectMongoDB } from "@/lib/mongodb";
import Corporation from "@/models/corporation"; // Corporation 모델의 경로를 확인하세요
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { companyName, businessNumber, location, contact, fax, representativeName, department, repContact, repEmail } = await req.json();
    await connectMongoDB();
    const newCorporation = await Corporation.create({
      companyName,
      businessNumber,
      location,
      contact,
      fax,
      representativeName,
      department,
      repContact,
      repEmail
    });

    return NextResponse.json({ message: "Corporation registered.", corporation: newCorporation }, { status: 201 });
  } catch (error) {
    console.error("Error registering corporation:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the corporation." },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectMongoDB();
    const results = await Corporation.find();
    return NextResponse.json(results)
  }