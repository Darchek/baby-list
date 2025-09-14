import { User, Product } from "./database";


const N8N_URL = process.env.N8N_URL || '';
const N8N_BASIC_TOKEN = process.env.N8N_BASIC_TOKEN || '';

export const sendEmailToReserve = async (user: User, product: Product) => {
  const response = await fetch(N8N_URL, {
        method: 'POST',
        headers: {
          "Authorization": `Basic ${N8N_BASIC_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user: user, product: product }),
    });
    const { data, error } = await response.json();
    return { data, error };
}
