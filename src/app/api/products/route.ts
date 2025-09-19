import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';
import * as cheerio from "cheerio";


export async function GET(request: NextRequest) {
  try {
    const products = await db.getProductsActivateList();

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const productData = {
      name: body.product.name,
      description: body.product.description,
      url: body.product.url || '',
      image_url: body.product.image_url || '',
      active: body.product.active !== undefined ? body.product.active : true,
    };

    const newProduct = await db.createProduct(productData);
    
    if (!newProduct) {
      return NextResponse.json(
        { success: false, error: 'Failed to create product' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Product created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // const url = "https://amzn.eu/d/gwRLs9j";
    const body = await request.json();
    const productUrl = body.productUrl;

    const data = await fetch(productUrl, {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0.0.0 Safari/537.36",
      },
    });

    const text = await data.text();
    const $ = cheerio.load(text);
    const metadata = {
      name: $('meta[property="og:title"]').attr("content") || $("#productTitle").text().trim(),
      description: $('meta[name="description"]').attr("content"),
      image_url: $('meta[property="og:image"]').attr("content") || $("#landingImage").attr("src"),
    };

    return NextResponse.json({
      success: true,
      data: metadata,
      count: 3,
    });
  } catch (error: any) {
    console.error("Error fetching metadata:", error.message);
    return NextResponse.json(
      { success: false, error: "Error fetching metadata: " + error.message },
      { status: 500 }
    );
  }
}
