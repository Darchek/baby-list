import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function POST(request: NextRequest) {
  const body = await request.json();
  const mode = body.mode;
  if (mode === 'thanks') {
    return thanksMode();
  }
  return defaultMode();
}


async function defaultMode() {
  try {
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

async function thanksMode() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY || "");

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        systemInstruction: `Ets un assistent molt intellegent i útil. Tenim una llista per comprar regals per una nena que encara no a nascut.
        La nena es dirà Joana.
        Es te previst que la nena neixi durant el mes de novembre de 2025.
        Genera una frase en divertida sobre aquesta situació.
        Tingues en compte que la frase serà mostrada quan una persona reserva un producte.
        S'ha de generar una frase divertida d'agraiment per a la persona que reserva el producte.
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
