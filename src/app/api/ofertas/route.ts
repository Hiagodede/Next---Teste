// Buscar ofertas detalhadas para o catálogo da home
export async function GET() {
    const client = await pool.connect();
    try {
        const query = `
            SELECT 
                o.idoferta,
                o.precoestimado,
                o.descricao,
                o.fotourl,
                p.nomeproduto,
                p.unidade,
                pr.cnpj_cpf,
                u.nomeusuario AS nomeprodutor,
                -- prop.nome AS nomepropriedade,
                f.local,
                f.datafeira
            FROM oferta o
            JOIN produto p ON o.idproduto = p.idproduto
            JOIN produtor pr ON o.idprodutor = pr.idprodutor
            JOIN usuario u ON pr.idprodutor = u.idusuario
            -- JOIN propriedade prop ON pr.idpropriedade = prop.idpropriedade
            JOIN feira f ON o.idfeira = f.idfeira
            ORDER BY o.idoferta DESC
            LIMIT 12
        `;
        const result = await client.query(query);
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ message: 'Erro ao buscar ofertas.' }, { status: 500 });
    } finally {
        client.release();
    }
}
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


// Deletar oferta
export async function DELETE(request: Request) {
    const client = await pool.connect();
    try {
        const url = new URL(request.url);
        const idOferta = url.searchParams.get('id');
        if (!idOferta) {
            return NextResponse.json({ message: 'ID da oferta não fornecido.' }, { status: 400 });
        }
        await client.query('DELETE FROM Oferta WHERE idOferta = $1', [idOferta]);
        return NextResponse.json({ message: 'Oferta deletada com sucesso.' });
    } catch (error) {
        console.error('Erro ao deletar oferta:', error);
        return NextResponse.json({ message: 'Erro interno ao deletar oferta.' }, { status: 500 });
    } finally {
        client.release();
    }
}

// Editar oferta
export async function PATCH(request: Request) {
    const client = await pool.connect();
    try {
        const { idOferta, precoEstimado, descricao, fotoURL } = await request.json();
        if (!idOferta) {
            return NextResponse.json({ message: 'ID da oferta não fornecido.' }, { status: 400 });
        }
        await client.query(
            'UPDATE Oferta SET precoEstimado = $1, descricao = $2, fotoURL = $3 WHERE idOferta = $4',
            [precoEstimado, descricao, fotoURL, idOferta]
        );
        return NextResponse.json({ message: 'Oferta editada com sucesso.' });
    } catch (error) {
        console.error('Erro ao editar oferta:', error);
        return NextResponse.json({ message: 'Erro interno ao editar oferta.' }, { status: 500 });
    } finally {
        client.release();
    }
}

// Buscar ofertas

