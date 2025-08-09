import { NextResponse } from 'next/server';
import pool from '../../../lib/db'; 

export async function POST(request: Request) {
    const client = await pool.connect();

    try {
        const { nomeUsuario, email, senha, telefone, cnpj_cpf } = await request.json();

        if (!nomeUsuario || !email || !senha || !telefone || !cnpj_cpf) {
            return NextResponse.json({ message: 'Campos obrigatórios ausentes.' }, { status: 400 });
        }
        
        await client.query('BEGIN');

        const usuarioQuery = `
            INSERT INTO Usuario (nomeUsuario, email, senha, telefone, tipo_usuario)
            VALUES ($1, $2, $3, $4, 'Produtor')
            RETURNING idUsuario; 
        `;
        const usuarioValues = [nomeUsuario, email, senha, BigInt(telefone)];
        const usuarioResult = await client.query(usuarioQuery, usuarioValues);
        
        const newUserId = usuarioResult.rows[0].idusuario;

        const produtorQuery = `
            INSERT INTO Produtor (idProdutor, cnpj_cpf)
            VALUES ($1, $2);
        `;
        const produtorValues = [newUserId, cnpj_cpf];
        await client.query(produtorQuery, produtorValues);

        await client.query('COMMIT');

        return NextResponse.json({ message: 'Produtor cadastrado com sucesso!', userId: newUserId }, { status: 201 });

    } catch (error) {
        await client.query('ROLLBACK');
        
        console.error('ERRO NA TRANSAÇÃO DE REGISTRO:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });

    } finally {
        client.release();
    }
}