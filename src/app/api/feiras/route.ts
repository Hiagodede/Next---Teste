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

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const body = await request.json();
        // Corrija os nomes dos campos para os que vêm do frontend
        const { nomeedicao, datafeira, local, statusfeira } = body;

        const query = `
            INSERT INTO Feira (nomeEdicao, dataFeira, local, statusFeira) 
            VALUES ($1, $2, $3, $4) RETURNING *;
        `;
        const values = [nomeedicao, datafeira, local, statusfeira];

        const result = await client.query(query, values);

        return NextResponse.json({ message: "Feira cadastrada com sucesso!", feira: result.rows[0] }, { status: 201 });

    } catch (error) {
        console.error('Erro ao cadastrar feira:', error);
        return NextResponse.json({ message: 'Erro interno do servidor ao cadastrar feira.' }, { status: 500 });
    } finally {
        client.release();
    }
}