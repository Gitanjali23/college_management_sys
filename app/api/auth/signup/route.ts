import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import connectDB from "@/lib/db";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { name, email, password, role, adminSecret, ...extraFields } = body;

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const validRoles = ["student", "teacher", "admin"];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { message: "Invalid role selected" },
        { status: 400 }
      );
    }

    // 🔥 SECURITY: Check for Admin Secret if role is admin
    if (role === "admin") {
      const serverSecret = process.env.ADMIN_SIGNUP_SECRET || "cms_admin_2026";
      if (adminSecret !== serverSecret) {
        return NextResponse.json(
          { message: "Unauthorized: Invalid Admin Authorization Key" },
          { status: 403 }
        );
      }
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user with all fields
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      ...extraFields,
    });

    await newUser.save();

    // Convert to object and omit password before sending
    const userToReturn = newUser.toObject();
    delete userToReturn.password;

    return NextResponse.json(
      { message: "User registered successfully", user: userToReturn },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("🔥 Signup Error Detail:", {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return NextResponse.json(
      { 
        message: "Internal server error", 
        error: error.message,
        details: error.errors ? Object.keys(error.errors).map(k => error.errors[k].message) : null
      },
      { status: 500 }
    );
  }
}
