import { NextRequest, NextResponse } from 'next/server';
import { db, Product } from '@/lib/database';

export async function GET(request: NextRequest) {
  try {
    let products: Product[];
    products = await db.getProductsActivateList();

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}