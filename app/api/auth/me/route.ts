import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/lib/models/User';
import { verifyAuth } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const authResult = await verifyAuth(req);

    if (!authResult.success || !authResult.decoded) {
      return NextResponse.json(
        { success: false, message: authResult.error },
        { status: 401 }
      );
    }

    await connectDB();
    
    // We get id from the verified JWT payload
    const userId = authResult.decoded.id;
    const user = await User.findById(userId).select('-passwordHash');

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    }, { status: 200 });

  } catch (error: any) {
    console.error('Verify Auth Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Server Error' },
      { status: 500 }
    );
  }
}
