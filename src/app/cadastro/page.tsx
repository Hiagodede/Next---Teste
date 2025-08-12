// src/app/cadastro/page.tsx

// 'use client' é obrigatório no topo do arquivo para componentes que usam hooks como useState e interatividade.
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function PaginaDeCadastro() {
  // Máscara visual para telefone
  function maskTelefone(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    if (value.length > 10) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
    } else if (value.length > 6) {
      return value.replace(/(\d{2})(\d{4,5})(\d{0,4})/, "($1) $2-$3");
    } else if (value.length > 2) {
      return value.replace(/(\d{2})(\d{0,5})/, "($1) $2");
    } else {
      return value;
    }
  }

  // Máscara visual para CPF/CNPJ
  function maskCpfCnpj(value: string) {
    value = value.replace(/\D/g, "");
    if (value.length <= 11) {
      value = value.slice(0, 11);
      if (value.length > 9) {
        return value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
      } else if (value.length > 6) {
        return value.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
      } else if (value.length > 3) {
        return value.replace(/(\d{3})(\d{0,3})/, "$1.$2");
      } else {
        return value;
      }
    } else {
      value = value.slice(0, 14);
      if (value.length > 12) {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
      } else if (value.length > 8) {
        return value.replace(/(\d{2})(\d{3})(\d{3})(\d{0,4})/, "$1.$2.$3/$4");
      } else if (value.length > 5) {
        return value.replace(/(\d{2})(\d{3})(\d{0,3})/, "$1.$2.$3");
      } else {
        return value;
      }
    }
  }

  // Atualiza o estado com máscara visual, mas salva limpo
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === "telefone") maskedValue = maskTelefone(value);
    if (name === "cnpj_cpf") maskedValue = maskCpfCnpj(value);
    setFormData((prevState) => ({
      ...prevState,
      [name]: maskedValue,
    }));
  };
  const router = useRouter();

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

  // 3. Função chamada quando o formulário é enviado
const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMensagem('');
    setErro('');

    // Limpa os campos para enviar ao backend (seu código original, correto)
    const cleanTelefone = formData.telefone.replace(/\D/g, "");
    const cleanCpfCnpj = formData.cnpj_cpf.replace(/\D/g, "");
    const payload = {
        ...formData,
        telefone: cleanTelefone,
        cnpj_cpf: cleanCpfCnpj,
    };

    try {
        // --- Passo 1: Tenta cadastrar o usuário ---
        const registerResponse = await fetch('/api/cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        const registerData = await registerResponse.json();
        if (!registerResponse.ok) {
            throw new Error(registerData.message || 'Falha no cadastro.');
        }

        // --- Passo 2: Se o cadastro deu certo, tenta fazer o login ---
        const loginResponse = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: formData.email, // Usa o email do formulário
                senha: formData.senha, // Usa a senha do formulário
            }),
        });

        const loginData = await loginResponse.json();
        if (!loginResponse.ok) {
            // Se o login falhar por algum motivo, avisa que o cadastro deu certo
            // mas que o login precisa ser feito manualmente.
            setMensagem('Cadastro realizado com sucesso! Por favor, faça o login.');
            router.push('/login'); // Leva para a página de login
            return;
        }

        // --- Passo 3: Se o login deu certo, salva o token e redireciona ---
        localStorage.setItem('authToken', loginData.token);
        router.push('/dashboard'); // AGORA SIM, redireciona para o dashboard!

    } catch (error: any) {
        setErro(error.message);
    }
};

  // Estilos para o modal igual ao login
  const inputClass = "w-full rounded-md border-gray-600 bg-gray-800 p-3 text-white shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50 mb-4";
  const labelClass = "block text-sm font-medium text-gray-200 mb-1";

  // 5. O JSX que renderiza o formulário na tela
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      {/* Imagem de fundo igual à home */}
      <img src="/feirahome.svg" alt="Fundo com itens da feira" className="absolute inset-0 w-full h-full object-cover -z-10" />
      <div className="absolute inset-0 bg-black/60 -z-10" />
      <div className="w-full max-w-md rounded-xl bg-gray-900/70 p-8 shadow-xl backdrop-blur-sm">
        <h1 className="text-center text-3xl font-bold text-white">Cadastro de Produtor</h1>
        <p className="text-center text-gray-300 mt-2">Preencha os dados para criar sua conta.</p>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="nomeUsuario" className={labelClass}>Nome Completo</label>
            <input id="nomeUsuario" name="nomeUsuario" type="text" value={formData.nomeUsuario} onChange={handleChange} required className={inputClass} placeholder="Seu nome completo" />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>Email</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className={inputClass} placeholder="seuemail@exemplo.com" />
          </div>
          <div>
            <label htmlFor="senha" className={labelClass}>Senha</label>
            <input id="senha" name="senha" type="password" value={formData.senha} onChange={handleChange} required className={inputClass} placeholder="********" />
          </div>
          <div>
            <label htmlFor="telefone" className={labelClass}>Telefone</label>
            <input id="telefone" name="telefone" type="text" value={formData.telefone} onChange={handleChange} required className={inputClass} placeholder="(99) 99999-9999" />
          </div>
          <div>
            <label htmlFor="cnpj_cpf" className={labelClass}>CNPJ/CPF</label>
            <input id="cnpj_cpf" name="cnpj_cpf" type="text" value={formData.cnpj_cpf} onChange={handleChange} required className={inputClass} placeholder="Digite seu CPF ou CNPJ" />
          </div>
          <button type="submit" className="w-full rounded-full bg-orange-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-700 mt-2">Cadastrar</button>
        </form>
        {mensagem && <p className="text-center text-green-400 text-sm mt-4 font-bold">{mensagem}</p>}
        {erro && <p className="text-center text-red-400 text-sm mt-4 font-bold">{erro}</p>}
      </div>
    </div>
  );
}