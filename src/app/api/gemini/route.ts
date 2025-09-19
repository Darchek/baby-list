import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import * as cheerio from "cheerio";


export async function POST(request: NextRequest) {
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


export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const prompt = body.prompt;

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: `Ets un assistent molt intellegent i útil. Tenim una llista per comprar regals per una nena que encara no a nascut.
        La nena es dirà Joana.
        Es te previst que la nena neixi durant el mes de novembre de 2025.
        Genera una frase en divertida sobre aquesta situació.
        Tingues en compte que la frase serà mostrada a la web on totes les persones que volen comprar un regal podran accedir a la llista i reservar el producte que els agradi més.
        No diguis res més que la frase. No donguis més informació. No donguis més opcions. Nomes genera la frase i res mes.
        `
    });


    const result = await model.generateContent({
        contents: [{
            role: "user",
            parts: [{ text: "Genera una frase" }]
        }]
    });
    
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({
      success: true,
      data: text,
      message: 'Generated text successfully',
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to generate text' },
      { status: 500 }
    );
  }
}
