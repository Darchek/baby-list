import { NextRequest, NextResponse } from 'next/server';
import { db, getUserByRequest } from '@/lib/database';


export async function GET(request: NextRequest) {
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

    const users = await db.getAllUsers();

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create a new user
export async function POST(request: NextRequest) {
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
    
    // Validate required fields
    if (!body.name || !body.email) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields: name, email' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }

    const userData = {
      name: body.name,
      email: body.email,
      password: body.password,
    };

    const newUser = await db.createUser(userData);

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'User created successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}


// POST /api/users - Login
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await db.loginUser(body.email, body.password);

    return NextResponse.json({
      success: true,
      data: data,
      message: 'User login successfully',
    }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

