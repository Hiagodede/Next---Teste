import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT),
});
// Busca produtos em destaque para a feira mais recente
export async function getProdutosDestaque() {
  const query = `
    SELECT 
      o.idOferta,
      o.fotoURL,
      o.descricao,
      p.idProduto,
      p.Descricao as nomeProduto, -- Confirme se o campo é 'Descricao' ou 'nome'
      p.Unidade,
      pr.nome as nomeProdutor,
      prop.nome as nomePropriedade,
      f.local as localFeira,
      f.data as dataFeira
    FROM Oferta o
    JOIN Produto p ON o.Produto_idProduto = p.idProduto
    JOIN Produtor pr ON o.Produtor_idProdutor = pr.idProdutor
    JOIN Propriedade prop ON pr.Propriedade_idPropriedade = prop.idPropriedade
    JOIN Feira f ON o.Feira_idFeira = f.idFeira
    WHERE f.data = (SELECT MAX(data) FROM Feira)
    LIMIT 4
  `;
  const { rows } = await pool.query(query);
  return rows;
}

// Busca informações da próxima feira
export async function getProximaFeira() {
  const { rows } = await pool.query(
    'SELECT * FROM Feira WHERE data >= CURRENT_DATE ORDER BY data ASC LIMIT 1'
  );
  // Retorna null se não houver feira futura
  return rows.length > 0 ? rows[0] : null;
}

// Busca todas as categorias
export async function getCategorias() {
  const { rows } = await pool.query('SELECT * FROM Categoria');
  return rows;
}

export default pool;

// Função para testar a conexão com o banco de dados
export async function testarConexaoBanco() {
  try {
    await pool.query('SELECT 1');
    return { sucesso: true, mensagem: 'Conexão bem-sucedida!' };
  } catch (error) {
    return { sucesso: false, mensagem: error.message };
  }
}