import { db, hashString } from '@/lib/database';
import { sendEmailToReserve } from '@/lib/n8n_webhooks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const authStr = request.headers.get('Authorization') || 'Bearer ';
    const token = authStr.split('Bearer ')[1];

    if (!token || token.length < 10) {
      return NextResponse.json(
        { success: false, error: 'No token provided' },
        { status: 401 }
      );
    }

    const user = await db.getUserByToken(token);
    if (!user || !user.id) {
        return NextResponse.json(
          { success: false, error: 'Token provided not valid' },
          { status: 401 }
        );
    }

    const product = await db.reserveProduct(id, user.id);

    if (!product) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    sendEmailToReserve(user, product);

    return NextResponse.json({
      success: true,
      data: product,
      message: 'Product reserved successfully',
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}