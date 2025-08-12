'use client';

import React, { useState, useEffect } from 'react';

// Interfaces para os tipos de dados
interface Produto {
    idproduto: number;
    nomeproduto: string;
    descricao: string;
    unidade: string;
    idcategoria: number;
}
interface Feira {
    idfeira: number;
    nomeedicao: string;
    datafeira: string;
}
interface Categoria {
    idcategoria: number;
    desccategoria: string;
}

interface OfertaDetalhada {
    fotoURL: string;
    idoferta: number;
    precoestimado: string;
    descricaooferta: string;
    nomeproduto: string;
    descricaoproduto: string;
    unidade: string;
    nomeedicao: string;
    datafeira: string;
}

export default function DashboardPage() {
    // Estados para as listas de dados
    const [ofertas, setOfertas] = useState<OfertaDetalhada[]>([]);
    const [catalogoProdutos, setCatalogoProdutos] = useState<Produto[]>([]);
    const [feiras, setFeiras] = useState<Feira[]>([]);
    const [categorias, setCategorias] = useState<Categoria[]>([]);

    const [ofertaAbertaId, setOfertaAbertaId] = useState<number | null>(null);
    
    // Estados de controle da página
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    
    // Estados para o formulário de NOVO PRODUTO
    const [novoProduto, setNovoProduto] = useState({
        nomeProduto: '',
        descricao: '',
        unidade: 'kg', 
        idCategoria: '', 
    });
    const [formErrorProduto, setFormErrorProduto] = useState('');

    // Estados para o formulário de NOVA OFERTA
    const [novaOferta, setNovaOferta] = useState({
        idProduto: '', // Adicionado idProduto
        idFeira: '',
        precoEstimado: '',
        descricao: '', 
        fotoURL: ''
    });
    const [formErrorOferta, setFormErrorOferta] = useState('');
    const [formSuccessOferta, setFormSuccessOferta] = useState('');

    // Função única para buscar todos os dados necessários
    const fetchData = async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('Você não está autenticado. Faça o login novamente.');
            
            const [produtosResponse, feirasResponse, catalogoResponse, categoriasResponse] = await Promise.all([
                fetch('/api/produtos', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('/api/feiras'),
                fetch('/api/catalogo-produtos'),
                fetch('/api/categorias')
            ]);

            if (!produtosResponse.ok) throw new Error('Falha ao buscar seus produtos ofertados.');

            setOfertas(await produtosResponse.json());
            setFeiras(await feirasResponse.json());
            setCatalogoProdutos(await catalogoResponse.json());
            setCategorias(await categoriasResponse.json());

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handlers para o formulário de NOVO PRODUTO
    const handleProdutoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNovoProduto(prevState => ({ ...prevState, [name]: value }));
    };

    const handleSubmitProduto = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrorProduto('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            setFormErrorProduto('Sua sessão expirou.');
            return;
        }
        try {
            const response = await fetch('/api/produtos', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    ...novoProduto,
                    idCategoria: parseInt(novoProduto.idCategoria)
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Falha ao cadastrar o produto.');
            
            setCatalogoProdutos(catalogoAnterior => [...catalogoAnterior, data]);
            setNovoProduto({ nomeProduto: '', descricao: '', unidade: 'kg', idCategoria: '' });
            alert('Produto cadastrado com sucesso!');
        } catch (err: any) {
            setFormErrorProduto(err.message);
        }
    };

    // Handlers para o formulário de NOVA OFERTA
    const handleOfertaChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setNovaOferta(prevState => ({ ...prevState, [name]: value }));
    };

    const handleOfertaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormErrorOferta('');
        setFormSuccessOferta('');
        const token = localStorage.getItem('authToken');
        if (!token) {
            setFormErrorOferta('Sua sessão expirou.');
            return;
        }
        try {
            const response = await fetch('/api/ofertas', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({
                    idProduto: parseInt(novaOferta.idProduto),
                    idFeira: parseInt(novaOferta.idFeira),
                    precoEstimado: parseFloat(novaOferta.precoEstimado),
                    descricao: novaOferta.descricao,
                    fotoURL: novaOferta.fotoURL
                }),
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Falha ao criar a oferta.');
            
            setFormSuccessOferta('Oferta criada com sucesso!');
            setNovaOferta({ idProduto: '', idFeira: '', precoEstimado: '', descricao: '', fotoURL: '' });
            fetchData();
        } catch (err: any) {
            setFormErrorOferta(err.message);
        }
    };

    // --- 2. NOVA FUNÇÃO PARA CONTROLAR A SANFONA (ACCORDION) ---
    const handleToggleDetalhes = (idDaOferta: number) => {
        // Se a oferta clicada já estiver aberta, nós a fechamos (setando para null)
        if (ofertaAbertaId === idDaOferta) {
            setOfertaAbertaId(null);
        } else {
            // Se outra oferta for clicada, nós a abrimos (setando o ID dela)
            setOfertaAbertaId(idDaOferta);
        }
    };

    // --- 3. NOVAS FUNÇÕES (PLACEHOLDERS) PARA EDITAR E DELETAR ---
    // Handler para deletar oferta
    const handleDeletarOferta = async (idDaOferta: number) => {
        if (confirm('Tem certeza que deseja deletar esta oferta?')) {
            try {
                const response = await fetch(`/api/ofertas?id=${idDaOferta}`, { method: 'DELETE' });
                const data = await response.json();
                if (!response.ok) throw new Error(data.message || 'Erro ao deletar oferta.');
                alert('Oferta deletada com sucesso!');
                fetchData();
            } catch (err: any) {
                alert(err.message);
            }
        }
    };

    // Modal de edição de oferta
    const [modalEditar, setModalEditar] = useState<{ aberto: boolean; oferta: OfertaDetalhada | null }>({ aberto: false, oferta: null });
    const [editOferta, setEditOferta] = useState({ precoEstimado: '', descricao: '', fotoURL: '' });
    const [editError, setEditError] = useState('');

    const handleEditarOferta = (oferta: OfertaDetalhada) => {
        setModalEditar({ aberto: true, oferta });
        setEditOferta({
            precoEstimado: oferta.precoestimado,
            descricao: oferta.descricaooferta || '',
            fotoURL: oferta.fotoURL || ''
        });
        setEditError('');
    };

    const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setEditOferta(prev => ({ ...prev, [name]: value }));
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!modalEditar.oferta) return;
        try {
            const response = await fetch('/api/ofertas', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    idOferta: modalEditar.oferta.idoferta,
                    precoEstimado: editOferta.precoEstimado,
                    descricao: editOferta.descricao,
                    fotoURL: editOferta.fotoURL
                })
            });
            const data = await response.json();
            if (!response.ok) throw new Error(data.message || 'Erro ao editar oferta.');
            setModalEditar({ aberto: false, oferta: null });
            fetchData();
        } catch (err: any) {
            setEditError(err.message);
        }
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><p className="text-xl">Carregando dados do produtor...</p></div>;
    if (error) return <div className="flex justify-center items-center h-screen"><p className="text-xl text-red-500">Erro: {error}</p></div>;

    return (
        <div className="bg-gray-100 min-h-screen p-4 sm:p-6 lg:p-8">
            {/* Modal de edição de oferta */}
            {modalEditar.aberto && modalEditar.oferta && (
                <div className="fixed inset-0 flex items-center justify-center z-50" style={{background: "rgba(0,0,0,0.15)", backdropFilter: "blur(2px)"}}>
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-semibold mb-4">Editar Oferta</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Preço Estimado (R$)</label>
                                <input type="number" name="precoEstimado" value={editOferta.precoEstimado} onChange={handleEditChange} step="0.01" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Descrição da Oferta</label>
                                <textarea name="descricao" value={editOferta.descricao} onChange={handleEditChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"></textarea>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">URL da Foto</label>
                                <input type="text" name="fotoURL" value={editOferta.fotoURL} onChange={handleEditChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                            </div>
                            {editError && <p className="text-red-600 text-sm">{editError}</p>}
                            <div className="flex gap-4 mt-4">
                                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Salvar</button>
                                <button type="button" className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500" onClick={() => setModalEditar({ aberto: false, oferta: null })}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <div className="max-w-7xl mx-auto">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Painel do Produtor</h1>
                    <p className="text-gray-600 mt-1">Gerencie seus produtos e ofertas para a próxima feira.</p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        {/* Ofertas Atuais */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Minhas Ofertas Atuais</h2>
                            {ofertas.length === 0 ? (
                                <p className="text-gray-500">Você ainda não tem nenhuma oferta ativa.</p>
                            ) : (
                                <ul className="space-y-3">
                                    {ofertas.map(oferta => (
                                        <li key={oferta.idoferta} className="bg-gray-50 rounded-md overflow-hidden transition-all duration-300">
                                            {/* Cabeçalho da Sanfona (Sempre visível) */}
                                            <div onClick={() => handleToggleDetalhes(oferta.idoferta)} className="p-4 flex justify-between items-center cursor-pointer hover:bg-gray-100">
                                                <div>
                                                    <span className="font-medium text-gray-800">{oferta.nomeproduto}</span>
                                                    <span className="block text-sm text-gray-500">para a feira: {oferta.nomeedicao}</span>
                                                </div>
                                                <span className="text-sm text-orange-600 font-semibold">
                                                    {ofertaAbertaId === oferta.idoferta ? 'Ocultar Detalhes' : 'Ver Detalhes'}
                                                </span>
                                            </div>
                                            {/* Corpo da Sanfona (Visível condicionalmente) */}
                                            {ofertaAbertaId === oferta.idoferta && (
                                                <div className="border-t border-gray-200 p-4 bg-white">
                                                    <div className="space-y-2 text-sm text-gray-700 mb-4">
                                                        <p><strong>Preço Estimado:</strong> R$ {parseFloat(oferta.precoestimado).toFixed(2).replace('.', ',')}</p>
                                                        <p><strong>Unidade:</strong> {oferta.unidade}</p>
                                                        <p><strong>Data da Feira:</strong> {new Date(oferta.datafeira).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <button onClick={() => handleEditarOferta(oferta)} className="bg-blue-500 text-white py-1 px-3 text-sm rounded-md hover:bg-blue-600">Editar</button>
                                                        <button onClick={() => handleDeletarOferta(oferta.idoferta)} className="bg-red-500 text-white py-1 px-3 text-sm rounded-md hover:bg-red-600">Deletar</button>
                                                    </div>
                                                </div>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* CARD PARA CRIAR NOVA OFERTA */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Criar Nova Oferta</h2>
                            <form onSubmit={handleOfertaSubmit} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label htmlFor="idFeira" className="block text-sm font-medium text-gray-700">Feira</label>
                                        <select id="idFeira" name="idFeira" value={novaOferta.idFeira} onChange={handleOfertaChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                                            <option value="" disabled>Selecione uma feira</option>
                                            {feiras.map(feira => <option key={feira.idfeira} value={feira.idfeira}>{feira.nomeedicao}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="idProduto" className="block text-sm font-medium text-gray-700">Produto</label>
                                        <select id="idProduto" name="idProduto" value={novaOferta.idProduto} onChange={handleOfertaChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                                            <option value="" disabled>Selecione um produto</option>
                                            {catalogoProdutos.map(produto => <option key={produto.idproduto} value={produto.idproduto}>{produto.nomeproduto}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div><label htmlFor="precoEstimado" className="block text-sm font-medium text-gray-700">Preço Estimado (R$)</label><input type="number" id="precoEstimado" name="precoEstimado" value={novaOferta.precoEstimado} onChange={handleOfertaChange} step="0.01" required placeholder="Ex: 10.50" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" /></div>
                                <div><label htmlFor="descricaoOferta" className="block text-sm font-medium text-gray-700">Descrição da Oferta</label><textarea id="descricaoOferta" name="descricao" value={novaOferta.descricao} onChange={handleOfertaChange} rows={3} placeholder="Ex: Tomates frescos, colhidos hoje." className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea></div>
                                <div><label htmlFor="fotoURL" className="block text-sm font-medium text-gray-700">URL da Foto (Opcional)</label><input type="text" id="fotoURL" name="fotoURL" value={novaOferta.fotoURL} onChange={handleOfertaChange} placeholder="https://exemplo.com/imagem.jpg" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" /></div>
                                <button type="submit" className="w-full justify-center rounded-md border border-transparent bg-orange-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2">Criar Oferta</button>
                                {formSuccessOferta && <p className="text-green-600 text-sm mt-2">{formSuccessOferta}</p>}
                                {formErrorOferta && <p className="text-red-600 text-sm mt-2">{formErrorOferta}</p>}
                            </form>
                        </div>
                    </div>

                    {/* COLUNA 2: CADASTRO DE NOVO PRODUTO */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Cadastrar Novo Produto</h2>
                            <p className="text-sm text-gray-500 mb-4">Não achou seu produto na lista? Adicione-o ao catálogo geral aqui.</p>
                            <form onSubmit={handleSubmitProduto} className="space-y-4">
                                <div><label htmlFor="nomeProduto" className="block text-sm font-medium text-gray-700">Nome do Produto</label><input type="text" id="nomeProduto" name="nomeProduto" value={novoProduto.nomeProduto} onChange={handleProdutoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500" /></div>
                                <div><label htmlFor="descricaoProduto" className="block text-sm font-medium text-gray-700">Descrição</label><textarea id="descricaoProduto" name="descricao" value={novoProduto.descricao} onChange={handleProdutoChange} rows={3} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"></textarea></div>
                                <div>
                                    <label htmlFor="unidade" className="block text-sm font-medium text-gray-700">Unidade</label>
                                    <select id="unidade" name="unidade" value={novoProduto.unidade} onChange={handleProdutoChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                                        <option value="kg">Quilograma (kg)</option>
                                        <option value="g">Grama (g)</option>
                                        <option value="un">Unidade (un)</option>
                                        <option value="dz">Dúzia (dz)</option>
                                        <option value="L">Litro (L)</option>
                                        <option value="ml">Mililitro (ml)</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="idCategoria" className="block text-sm font-medium text-gray-700">Categoria</label>
                                    <select id="idCategoria" name="idCategoria" value={novoProduto.idCategoria} onChange={handleProdutoChange} required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500">
                                        <option value="" disabled>Selecione uma categoria</option>
                                        {categorias.map(categoria => <option key={categoria.idcategoria} value={categoria.idcategoria}>{categoria.desccategoria}</option>)}
                                    </select>
                                </div>
                                <button type="submit" className="w-full justify-center rounded-md border border-transparent bg-gray-700 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-600 focus:ring-offset-2">Cadastrar Produto no Catálogo</button>
                                {formErrorProduto && <p className="text-red-600 text-sm mt-2">{formErrorProduto}</p>}
                            </form>
                        </div>
                    </div>
                </main>
            </div>           
        </div>
    );
}