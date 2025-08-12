import { NextResponse } from 'next/server';
import pool from '../../../lib/db';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const perfil = searchParams.get('perfil');
  let query = 'SELECT * FROM Usuario';
  let params: any[] = [];
  if (perfil) {
    query += ' WHERE tipo_usuario = $1';
    params = [perfil];
  }
  try {
    const client = await pool.connect();
    const result = await client.query(query, params);
    client.release();
    return NextResponse.json(result.rows);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
