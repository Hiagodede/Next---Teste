import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

import jwt from 'jsonwebtoken';
import pool from '../../../lib/db'; 

interface TokenPayload {
    id: number;
    nome: string;
    perfil: string;
}

export async function GET(request: Request) {
    const client = await pool.connect();
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Token de autorização não fornecido.' }, { status: 401 });
        }

        const parts = authorization.split(' ');
        if (parts.length !== 2 || parts[0] !== 'Bearer') {
            return NextResponse.json({ message: 'Token mal formatado.' }, { status: 401 });
        }

        const token = parts[1];
        
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;


        const idProdutor = payload.id;

        const query = `
            SELECT DISTINCT p.* FROM Produto p
            JOIN Oferta o ON p.idProduto = o.idProduto
            WHERE o.idProdutor = $1;
        `;

        const result = await client.query(query, [idProdutor]);

        return NextResponse.json(result.rows, { status: 200 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
        }
        console.error('Erro ao buscar produtos:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const headersList = await headers();
        const authorization = headersList.get('authorization');

        if (!authorization) {
            return NextResponse.json({ message: 'Token de autorização não fornecido.' }, { status: 401 });
        }
        const token = authorization.split(' ')[1];

        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as TokenPayload;
        if (payload.perfil !== 'Produtor') {
            return NextResponse.json({ message: 'Acesso negado. Apenas produtores podem cadastrar produtos.' }, { status: 403 });
        }

        const { nomeProduto, descricao, unidade, idCategoria } = await request.json();

        if (!nomeProduto || !unidade || !idCategoria) {
            return NextResponse.json({ message: 'Os campos nomeProduto, unidade e idCategoria são obrigatórios.' }, { status: 400 });
        }

        const insertQuery = `
            INSERT INTO Produto (nomeProduto, descricao, unidade, idCategoria)
            VALUES ($1, $2, $3, $4)
            RETURNING *;
        `;
        const values = [nomeProduto, descricao, unidade, idCategoria];
        
        const result = await client.query(insertQuery, values);
        const novoProduto = result.rows[0];

        return NextResponse.json(novoProduto, { status: 201 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
        }
        console.error('Erro ao cadastrar produto:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    } finally {
        client.release();
    }
}