import { db, getUserByRequest } from '@/lib/database';
import { sendEmailToReserve } from '@/lib/n8n_webhooks';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;

    const user = await getUserByRequest(request);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
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