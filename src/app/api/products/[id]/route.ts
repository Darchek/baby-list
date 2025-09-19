import { NextRequest, NextResponse } from 'next/server';
import { db, getUserByRequest } from '@/lib/database';

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const user = await getUserByRequest(request);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 } 
      );
    }

    if (user.id >= 3) {
      return NextResponse.json(
        { success: false, error: 'User not valid' },
        { status: 404 } 
      );
    }

    const { id } = await context.params;
    const body = await request.json();

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    const updatedProduct = await db.updateProduct(productId, body.product);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {

    const user = await getUserByRequest(request);
    if (!user || !user.id) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 } 
      );
    }

    if (user.id >= 3) {
      return NextResponse.json(
        { success: false, error: 'User not valid' },
        { status: 404 } 
      );
    }


    const { id } = await context.params;

    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid product ID' },
        { status: 400 }
      );
    }
    
    const updatedProduct = await db.deleteProduct(productId);
    
    if (!updatedProduct) {
      return NextResponse.json(
        { success: false, error: 'Product not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedProduct,
      message: 'Product updated successfully'
    });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update product' },
      { status: 500 }
    );
  }
}
