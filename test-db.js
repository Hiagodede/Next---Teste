// test-db.js

// 1. Carrega as variáveis do arquivo .env para o process.env
require('dotenv').config();

// 2. Importa o nosso pool de conexões já configurado
const pool = require('./src/lib/db').default;

async function testConnection() {
  try {
    console.log('Tentando conectar ao banco de dados...');
    
    // 3. Pega uma conexão do pool e executa uma query simples
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()'); // Pede a hora atual do servidor PostgreSQL
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('   Hora do banco de dados:', result.rows[0].now);
    
    // 4. Libera a conexão de volta para o pool
    client.release();

  } catch (error) {
    console.error('❌ Falha na conexão com o banco de dados:');
    console.error(error.stack);
  } finally {
    // 5. Fecha o pool para que o script possa terminar
    await pool.end();
  }
}

testConnection();