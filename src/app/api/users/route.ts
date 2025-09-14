import { NextRequest, NextResponse } from 'next/server';
import { db, User } from '@/lib/database';
import { supabase } from '@/lib/supabase';

// GET /api/users - Get all users or filter by email
export async function GET(request: NextRequest) {
  try {
    let users: User[];
    users = await db.getAllUsers();

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

    // Validate age if provided
    if (body.age && (body.age < 1 || body.age > 150)) {
      return NextResponse.json(
        { success: false, error: 'Age must be between 1 and 150' },
        { status: 400 }
      );
    }

    const userData = {
      name: body.name,
      email: body.email,
      age: body.age || undefined,
      phone: body.phone || undefined,
      address: body.address || undefined,
      notes: body.notes || undefined,
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
    console.log(body);

    const data = await db.loginUser(body.email, body.password);
    console.log(data);

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

