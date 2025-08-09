// src/app/cadastro/page.tsx

// 'use client' é obrigatório no topo do arquivo para componentes que usam hooks como useState e interatividade.
'use client';

import React, { useState } from 'react';

export default function PaginaDeCadastro() {
  // 1. Estados para guardar os dados do formulário e as mensagens de feedback
  const [formData, setFormData] = useState({
    nomeUsuario: '',
    email: '',
    senha: '',
    telefone: '',
    cnpj_cpf: '',
  });
  const [mensagem, setMensagem] = useState('');
  const [erro, setErro] = useState('');

  // 2. Função para atualizar o estado conforme o usuário digita
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // 3. Função chamada quando o formulário é enviado
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Impede o recarregamento padrão da página
    setMensagem('');
    setErro('');

    try {
      // 4. Chamada para a sua API de back-end usando fetch
      const response = await fetch('/api/cadastro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Converte os dados do formulário para uma string JSON
      });

      const data = await response.json();

      // Se a resposta da API não for de sucesso (ex: status 409, 500)
      if (!response.ok) {
        // Lança um erro com a mensagem que veio da API
        throw new Error(data.message || 'Algo deu errado ao tentar cadastrar.');
      }

      // Se a resposta for de sucesso
      setMensagem(data.message || 'Cadastro realizado com sucesso!');
      // Opcional: Limpar o formulário após o sucesso
      setFormData({
        nomeUsuario: '',
        email: '',
        senha: '',
        telefone: '',
        cnpj_cpf: '',
      });

    } catch (error: any) {
      // Captura o erro (seja da rede ou lançado por nós) e o exibe
      setErro(error.message);
    }
  };

  // Estilos simples embutidos para legibilidade
  const inputStyle = {
    display: 'block',
    width: '300px',
    padding: '8px',
    marginBottom: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
  };
  const labelStyle = {
    marginBottom: '5px',
    display: 'block',
    fontWeight: 'bold',
  };

  // 5. O JSX que renderiza o formulário na tela
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>Cadastro de Novo Produtor</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label style={labelStyle} htmlFor="nomeUsuario">Nome Completo</label>
          <input style={inputStyle} type="text" id="nomeUsuario" name="nomeUsuario" value={formData.nomeUsuario} onChange={handleChange} required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="email">Email</label>
          <input style={inputStyle} type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="senha">Senha</label>
          <input style={inputStyle} type="password" id="senha" name="senha" value={formData.senha} onChange={handleChange} required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="telefone">Telefone</label>
          <input style={inputStyle} type="text" id="telefone" name="telefone" value={formData.telefone} onChange={handleChange} required />
        </div>
        <div>
          <label style={labelStyle} htmlFor="cnpj_cpf">CNPJ/CPF</label>
          <input style={inputStyle} type="text" id="cnpj_cpf" name="cnpj_cpf" value={formData.cnpj_cpf} onChange={handleChange} required />
        </div>
        <button type="submit" style={{ padding: '10px 15px', cursor: 'pointer' }}>Cadastrar</button>
      </form>

      {/* 6. Exibição das mensagens de feedback */}
      {mensagem && <p style={{ color: 'green', marginTop: '15px' }}>{mensagem}</p>}
      {erro && <p style={{ color: 'red', marginTop: '15px' }}>{erro}</p>}
    </div>
  );
}