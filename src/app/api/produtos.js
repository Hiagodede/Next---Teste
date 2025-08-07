import { getProdutosDestaque, getProximaFeira } from '@/lib/db';

export async function GET() {
  try {
    const [produtos, feira] = await Promise.all([
      getProdutosDestaque(),
      getProximaFeira()
    ]);
    
    return new Response(JSON.stringify({ produtos, feira }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}