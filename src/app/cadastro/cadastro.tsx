// Estrutura baseada no modelo relacional com login via tabela Usuario

// === DEPENDÊNCIAS NECESSÁRIAS ===
// npm install bcrypt jsonwebtoken pg cookie

// === /app/api/auth/register-produtor/route.ts ===
import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: 'postgres://user:senha@localhost:5432/seubanco' });

export async function POST(req: Request) {
  const { nome, email, senha, idPropriedade } = await req.json();
  const senhaHash = await hash(senha, 10);

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const usuarioRes = await client.query(
      `INSERT INTO "Usuario" (email, senha, "Perfil") VALUES ($1, $2, 'produtor') RETURNING "idUsuario"`,
      [email, senhaHash]
    );

    const idUsuario = usuarioRes.rows[0].idUsuario;

    await client.query(
      `INSERT INTO "Produtor" (nome, "dataAdesao", "Propriedade_idPropriedade", "Usuario_idUsuario")
       VALUES ($1, CURRENT_DATE, $2, $3)`,
      [nome, idPropriedade, idUsuario]
    );

    await client.query('COMMIT');
    return NextResponse.json({ success: true });
  } catch (err) {
    await client.query('ROLLBACK');
    return NextResponse.json({ error: 'Erro ao registrar produtor.' }, { status: 500 });
  } finally {
    client.release();
  }
}

// === /app/api/auth/login/route.ts ===
import { compare } from 'bcrypt';
import { sign } from 'jsonwebtoken';

const JWT_SECRET = 'chave_secreta_segura';

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  const result = await pool.query('SELECT * FROM "Usuario" WHERE email = $1', [email]);
  const usuario = result.rows[0];

  if (!usuario || !(await compare(senha, usuario.senha))) {
    return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
  }

  const token = sign({ id: usuario.idUsuario, perfil: usuario.Perfil }, JWT_SECRET, { expiresIn: '1d' });

  const res = NextResponse.json({ success: true });
  res.cookies.set('token', token, { httpOnly: true, secure: true });
  return res;
}

// === middleware.ts ===
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    verify(token, 'chave_secreta_segura');
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
