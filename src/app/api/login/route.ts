import { NextResponse } from 'next/server';
import pool from '../../../lib/db';
import jwt from 'jsonwebtoken'; 

export async function POST(request: Request) {
    const client = await pool.connect();
    try {
        const { email, senha } = await request.json();

        if (!email || !senha) {
            return NextResponse.json({ message: 'Campos obrigatórios ausentes.' }, { status: 400 });
        }

        const usuarioQuery = 'SELECT * FROM Usuario WHERE email = $1';
        const usuarioResult = await client.query(usuarioQuery, [email]);

        if (usuarioResult.rowCount === 0) {
            return NextResponse.json({ message: 'Email ou senha inválidos.' }, { status: 401 });
        }

        const usuarioDoBanco = usuarioResult.rows[0];

        if (usuarioDoBanco.senha !== senha) { 
            return NextResponse.json({ message: 'Email ou senha inválidos.' }, { status: 401 });
        }

        const payload = {
            id: usuarioDoBanco.idusuario,
            nome: usuarioDoBanco.nomeusuario,
            perfil: usuarioDoBanco.tipo_usuario,
        };

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            throw new Error('A chave secreta JWT (JWT_SECRET) não está definida no arquivo .env!');
        }

        const token = jwt.sign(payload, secret, {
            expiresIn: '1h', 
        });

        return NextResponse.json({ message: 'Login bem-sucedido!', token: token });

    } catch (error: any) {
        console.error('Erro no login:', error);
        return NextResponse.json({ message: 'Erro interno do servidor.' }, { status: 500 });
    } finally {
        client.release();
    }
}