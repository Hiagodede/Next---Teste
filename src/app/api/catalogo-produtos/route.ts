import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET() {
    const client = await pool.connect();
    try {
        // Query simples para buscar todos os produtos do catálogo
        const query = 'SELECT * FROM Produto ORDER BY nomeProduto ASC;';
        const result = await client.query(query);
        return NextResponse.json(result.rows, { status: 200 });
    } catch (error) {
        console.error('Erro ao buscar o catálogo de produtos:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    } finally {
        client.release();
    }
}