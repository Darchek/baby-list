import { NextRequest, NextResponse } from 'next/server';
import { db, getUserByRequest, hashString } from '@/lib/database';

// POST /api/users/token By token
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const user = await db.getUserByToken(body.token);
    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}


// PUT /api/users/token RESET PASSWORD
export async function PUT(request: NextRequest) {
  try {

    const user = await getUserByRequest(request);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 } 
      );
    }

    if (user.id > 3) {
      return NextResponse.json(
        { success: false, error: 'User not valid' },
        { status: 404 } 
      );
    }

    const body = await request.json();
    const userId = body.user.id;
    const hashPassword = await hashString(body.user.password);

    const newUser = await db.updateUser(userId, { password: hashPassword });
    
    return NextResponse.json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}


