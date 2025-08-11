
// /pages/api/produtos.ts
import pool from '../../lib/db';
import { NextApiRequest, NextApiResponse } from 'next';

interface ProdutoDestaque {
    idOferta: number;
    nomeProduto: string;
    precoEstimado: number;
    unidade: string;
    nomeBarraca: string;
    fotoURL: string;
}


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<ProdutoDestaque[] | { error: string }>
) {
    try {
        const client = await pool.connect();
        const result = await client.query<ProdutoDestaque>(`
            SELECT
                o.idOferta,
                p.nomeProduto,
                o.precoEstimado,
                p.unidade,
                pr.nome AS nomeBarraca,
                COALESCE(o.fotoURL, '/imagens/placeholder.jpg') AS fotoURL
            FROM Oferta o
            JOIN Produto p ON o.idProduto = p.idProduto
            JOIN Produtor prod ON o.idProdutor = prod.idProdutor
            JOIN Propriedade pr ON prod.idPropriedade = pr.idPropriedade
            JOIN Feira f ON o.idFeira = f.idFeira
            WHERE f.statusFeira = 'Ativa'
            LIMIT 8;
            `);

        client.release();

        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
}
