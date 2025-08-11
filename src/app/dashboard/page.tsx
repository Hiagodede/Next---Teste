'use client';

import React, { useState, useEffect } from 'react';

// Interface para os dados do produto, incluindo idcategoria
interface Produto {
    idproduto: number;
    nomeproduto: string;
    descricao: string;
    unidade: string;
    idcategoria: number; // Adicionado para ser completo
}

export default function DashboardPage() {
    // --- ESTADOS UNIFICADOS ---
    // Estados para a lista de produtos
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Estados para o formulário de novo produto
    const [novoProduto, setNovoProduto] = useState({
        nomeProduto: '',
        descricao: '',
        unidade: '',
        idCategoria: 1, // Valor padrão para a categoria
    });
    const [formError, setFormError] = useState('');

    // --- LÓGICA DE BUSCA INICIAL ---
    // Este useEffect busca a lista de produtos quando a página carrega
    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const token = localStorage.getItem('authToken');
                if (!token) {
                    setError('Você não está autenticado.');
                    setLoading(false);
                    return;
                }
                const response = await fetch('/api/produtos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Falha ao buscar os produtos.');
                }
                const data: Produto[] = await response.json();
                setProdutos(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProdutos();
    }, []);

    // --- LÓGICA DO FORMULÁRIO ---
    // Função para atualizar o estado do formulário
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNovoProduto(prevState => ({
            ...prevState,
            [name]: name === 'idCategoria' ? parseInt(value) : value,
        }));
    };

    // Função para enviar o novo produto para a API
    const handleSubmitProduto = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            setFormError('Sua sessão expirou.');
            return;
        }
        try {
            const response = await fetch('/api/produtos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(novoProduto),
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Falha ao cadastrar o produto.');
            }
            // A MÁGICA ACONTECE AQUI:
            // Atualizamos a lista de produtos com o novo produto que a API retornou
            setProdutos(prevProdutos => [...prevProdutos, data]);
            // Limpamos o formulário
            setNovoProduto({ nomeProduto: '', descricao: '', unidade: '', idCategoria: 1 });
            alert('Produto cadastrado com sucesso!');
        } catch (err: any) {
            setFormError(err.message);
        }
    };

    // --- RENDERIZAÇÃO DA PÁGINA ---
    if (loading) return <p>Carregando seus produtos...</p>;
    if (error) return <p style={{ color: 'red' }}>Erro: {error}</p>;

    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif', display: 'flex', gap: '50px' }}>
            {/* Seção da Lista de Produtos */}
            <div>
                <h1>Painel do Produtor</h1>
                <h2>Meus Produtos Ofertados</h2>
                {produtos.length === 0 ? (
                    <p>Você ainda não ofertou nenhum produto.</p>
                ) : (
                    <ul>
                        {produtos.map(produto => (
                            <li key={produto.idproduto}>
                                <strong>{produto.nomeproduto}</strong> - Unidade: {produto.unidade}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Seção do Formulário de Cadastro */}
            <div>
                <h2>Cadastrar Novo Produto</h2>
                <form onSubmit={handleSubmitProduto}>
                    {/* Campos do formulário como na resposta anterior */}
                    <div><label>Nome do Produto</label><input type="text" name="nomeProduto" value={novoProduto.nomeProduto} onChange={handleInputChange} required /></div>
                    <div><label>Descrição</label><textarea name="descricao" value={novoProduto.descricao} onChange={handleInputChange}></textarea></div>
                    <div><label>Unidade</label><input type="text" name="unidade" value={novoProduto.unidade} onChange={handleInputChange} required /></div>
                    <div>
                        <label>Categoria</label>
                        <select name="idCategoria" value={novoProduto.idCategoria} onChange={handleInputChange}>
                            <option value={1}>Frutas</option>
                            <option value={2}>Verduras</option>
                            <option value={3}>Artesanato</option>
                        </select>
                    </div>
                    <button type="submit">Cadastrar Produto</button>
                    {formError && <p style={{ color: 'red' }}>{formError}</p>}
                </form>
            </div>
        </div>
    );
}