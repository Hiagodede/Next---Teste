import { NextRequest } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
  try {
    const query = `
      SELECT 
        o.idOferta,
        o.fotoURL,
        o.descricao,
        o.precoEstimado,
        p.idProduto,
        p.nomeProduto,
        p.unidade,
        pr.idProdutor,
        u.nomeUsuario AS nomeProdutor,
        prop.nome AS nomePropriedade,
        f.local AS localFeira,
        f.dataFeira
      FROM Oferta o
      JOIN Produto p ON o.idProduto = p.idProduto
      JOIN Produtor pr ON o.idProdutor = pr.idProdutor
      JOIN Usuario u ON pr.idProdutor = u.idUsuario
      JOIN Propriedade prop ON pr.idPropriedade = prop.idPropriedade
      JOIN Feira f ON o.idFeira = f.idFeira
      WHERE f.dataFeira = (SELECT MAX(dataFeira) FROM Feira WHERE statusFeira = 'Ativa')
      LIMIT 20;
    `;

    const { rows } = await pool.query(query);

    // Corrige o campo fotoURL para garantir que não venha nulo ou com espaços
    const produtosCorrigidos = rows.map(produto => ({
      ...produto,
      fotoURL: produto.fotourl ? produto.fotourl.trim() : null // <-- usa fotourl minúsculo
    }));

    return Response.json(produtosCorrigidos, { status: 200 });
  } catch (error) {
    console.error('Erro API /api/produtos:', error);
    return Response.json({ error: 'Erro ao buscar produtos em destaque' }, { status: 500 });
  }
}
