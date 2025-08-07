import { getProdutosDestaque, getProximaFeira } from '@/lib/db';

export async function GET() {
  try {
    const produtos = await getProdutosDestaque();
    const feira = await getProximaFeira();
    return Response.json({ produtos, feira });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}