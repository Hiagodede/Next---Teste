import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

export async function GET() {
    const client = await pool.connect();
    try {
        const query = `
            SELECT * FROM Feira 
            WHERE statusFeira = 'Planejada' 
            ORDER BY dataFeira ASC;
        `;
        
        const result = await client.query(query);

        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        console.error('Erro ao buscar feiras:', error);
        return NextResponse.json({ message: 'Erro interno do servidor ao buscar feiras.' }, { status: 500 });
    } finally {
        client.release();
    }
}