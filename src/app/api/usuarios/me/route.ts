import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ message: 'Token não fornecido.' }, { status: 401 });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ message: 'Token mal formatado.' }, { status: 401 });
    }
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return NextResponse.json({ message: 'JWT_SECRET não configurado.' }, { status: 500 });
    }
    const payload = jwt.verify(token, secret) as any;
    // Retorna os dados do usuário presentes no token
    return NextResponse.json({
      id: payload.id,
      nome: payload.nome,
      perfil: payload.perfil,
    });
  } catch (error: any) {
    return NextResponse.json({ message: 'Token inválido ou expirado.' }, { status: 401 });
  }
}
