import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';
import pool from '../../../lib/db'; 

interface TokenPayload {
    id: number;
    nome: string;
    perfil: string;
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
            return NextResponse.json({ message: 'Acesso negado. Apenas produtores podem cadastrar ofertas.' }, { status: 403 });
        }


        const { idProduto, idFeira, precoEstimado, descricao, fotoURL } = await request.json();

        if (!idProduto || !idFeira) {
            return NextResponse.json({ message: 'Os campos idProduto e idFeira são obrigatórios.' }, { status: 400 });
        }

        const idProdutor = payload.id;

        const insertQuery = `
            INSERT INTO Oferta (idProdutor, idProduto, idFeira, precoEstimado, descricao, fotoURL)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const values = [idProdutor, idProduto, idFeira, precoEstimado, descricao, fotoURL];
        
        const result = await client.query(insertQuery, values);
        const novaOferta = result.rows[0];

        return NextResponse.json(novaOferta, { status: 201 });

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
        }
        console.error('Erro ao cadastrar oferta:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    } finally {
        client.release();
    }
}