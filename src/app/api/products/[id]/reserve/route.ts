import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      );
    }

    const productId = parseInt(params.id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }

    const updatedProduct = await db.reserveProduct(productId.toString(), userId);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found or already reserved' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product reserved successfully'
    });
  } catch (error) {
    console.error('Error reserving product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reserve product' },
      { status: 500 }
    );
  }
}
