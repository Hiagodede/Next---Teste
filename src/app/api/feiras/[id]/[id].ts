import { NextResponse } from 'next/server';
import pool from '../../../../lib/db';

function getIdFromUrl(request: Request) {
    const url = new URL(request.url);
    const parts = url.pathname.split('/');
    return parts[parts.length - 1];
}

export async function DELETE(request: Request) {
    const client = await pool.connect();
    try {
        const id = getIdFromUrl(request);
        await client.query('DELETE FROM Feira WHERE idFeira = $1', [id]);
        return NextResponse.json({ message: 'Feira excluída com sucesso!' });
    } catch (error) {
        console.error('Erro ao excluir feira:', error);
        return NextResponse.json({ message: 'Erro ao excluir feira.' }, { status: 500 });
    } finally {
        client.release();
    }
}

export async function PUT(request: Request) {
    const client = await pool.connect();
    try {
        const id = getIdFromUrl(request);
        const body = await request.json();
        const { nomeedicao, datafeira, local, statusfeira } = body;
        await client.query(
            `UPDATE Feira SET nomeEdicao = $1, dataFeira = $2, local = $3, statusFeira = $4 WHERE idFeira = $5`,
            [nomeedicao, datafeira, local, statusfeira, id]
        );
        return NextResponse.json({ message: 'Feira atualizada com sucesso!' });
    } catch (error) {
        console.error('Erro ao editar feira:', error);
        return NextResponse.json({ message: 'Erro ao editar feira.' }, { status: 500 });
    } finally {
        client.release();
    }
}