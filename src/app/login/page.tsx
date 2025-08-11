'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from 'next/link';

export default function PaginaDeLogin() {
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [erro, setErro] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErro(''); 
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, senha }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Falha no login');
            }

            localStorage.setItem('authToken', data.token);
            console.log('Login bem-sucedido! Redirecionando...'); 
            router.push('/dashboard');
        } catch (error: any) {
            setErro(error.message);
        }
    };

    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
            <Image
                src="/feirahome.svg" 
                alt="Fundo com itens da feira"
                fill
                className="object-cover -z-10"
            />
            <div className="absolute inset-0 bg-black/60 -z-10" />

            <div className="w-full max-w-md rounded-xl bg-gray-900/70 p-8 shadow-xl backdrop-blur-sm">
                <h1 className="text-center text-3xl font-bold text-white">
                    Acessar Conta
                </h1>
                <p className="text-center text-gray-300 mt-2">
                    Bem-vindo(a) de volta!
                </p>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-200">
                            Email
                        </label>
                        <div className="mt-1">
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="seuemail@exemplo.com"
                                className="w-full rounded-md border-gray-600 bg-gray-800 p-3 text-white shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="senha" className="block text-sm font-medium text-gray-200">
                            Senha
                        </label>
                        <div className="mt-1">
                            <input
                                id="senha"
                                type="password"
                                value={senha}
                                onChange={(e) => setSenha(e.target.value)}
                                required
                                placeholder="********"
                                className="w-full rounded-md border-gray-600 bg-gray-800 p-3 text-white shadow-sm focus:border-orange-500 focus:ring focus:ring-orange-500 focus:ring-opacity-50"
                            />
                        </div>
                    </div>

                    {erro && (
                        <p className="text-center text-red-400 text-sm">
                            {erro}
                        </p>
                    )}

                    <div>
                        <button 
                            type="submit"
                            className="w-full rounded-full bg-orange-600 px-8 py-3 text-lg font-semibold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-700"
                        >
                            Entrar
                        </button>
                    </div>
                </form>

                <div className="mt-6 text-center text-sm text-gray-300">
                    <p>
                        Não tem uma conta?{' '}
                        <Link href="/cadastro" className="font-semibold text-orange-400 hover:underline">
                            Cadastre-se aqui
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}