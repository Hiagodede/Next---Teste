import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

export async function GET() {
    const client = await pool.connect();
    try {
        // Query SQL para buscar todas as categorias, ordenadas em ordem alfabética
        const query = 'SELECT * FROM Categoria ORDER BY descCategoria ASC;';
        
        const result = await client.query(query);

        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar categorias:', error);
        return NextResponse.json({ message: 'Erro interno do servidor ao buscar categorias.' }, { status: 500 });
    } finally {
        client.release();
    }
}