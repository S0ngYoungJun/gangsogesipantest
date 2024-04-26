import { connectMongoDB } from "@/lib/mongodb";
import clientMembers from "@/models/ClientMember"
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { memberId, password } = await req.json();
    const hashedPassword = await bcrypt.hash(password, 10);
    await connectMongoDB();
    await clientMembers.create({ memberId, password}); // password: hashedPassword

    return NextResponse.json({ message: "User registered.", }, { status: 201 });
  } catch (error) {
    console.error("Error registering user:", error);
    return NextResponse.json(
      { message: "An error occurred while registering the user." },
      { status: 500 }
    );
  }
}