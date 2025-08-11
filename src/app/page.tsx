'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

type ProdutoDestaque = {
  idOferta: number;
  fotoURL: string;
  descricao: string | null;
  precoEstimado: string | null;
  idProduto: number;
  nomeProduto: string;
  unidade: string;
  nomeProdutor: string;
  nomePropriedade: string;
  localFeira: string;
  dataFeira: string;
};

export default function Home() {
  const [produtos, setProdutos] = useState<ProdutoDestaque[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setErro(data.error);
        } else {
          // Mapeia os campos para camelCase
          const produtosFormatados = data.map((produto: any) => ({
            idOferta: produto.idoferta,
            fotoURL: produto.fotourl ? produto.fotourl.trim() : "/imagens/placeholder.svg",
            descricao: produto.descricao,
            precoEstimado: produto.precoestimado,
            idProduto: produto.idproduto,
            nomeProduto: produto.nomeproduto,
            unidade: produto.unidade,
            nomeProdutor: produto.nomeprodutor,
            nomePropriedade: produto.nomepropriedade,
            localFeira: produto.localfeira,
            dataFeira: produto.datafeira,
          }));
          setProdutos(produtosFormatados);
        }
      })
      .catch(() => setErro('Erro ao buscar produtos'));
  }, []);

  if (erro) {
    return <div>Erro: {erro}</div>;
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#8B6B3B] text-white py-4 px-8 flex justify-between items-center">
        <div>
          <img src="/logo.svg" alt="UFES" className="h-12" />
        </div>
        <nav className="flex space-x-6 text-sm font-medium">
          <Link href="/" className="hover:underline border-r border-white pr-6">
            Home
          </Link>
          <Link href="/sobre" className="hover:underline border-r border-white pr-6">
            Sobre a Feira
          </Link>
          <Link href="/produtos" className="hover:underline border-r border-white pr-6">
            Produtos
          </Link>
          <Link href="/barracas" className="hover:underline border-r border-white pr-6">
            Barracas
          </Link>
          <Link href="/cadastro" className="hover:underline border-r border-white pr-6">
            Cadastro do produtor
          </Link>
          <Link href="/contato" className="hover:underline">
            Contato
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[400px] flex flex-col justify-center items-center text-center px-4"
        style={{ backgroundImage: "url('/feirahome.svg')" }}
      >
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-white text-4xl font-bold mb-4">
            Bem-vindo à Feira Agroecológica da UFES
          </h1>
          <p className="text-white mb-8 text-lg">
            Explore produtos frescos e artesanais direto da agricultura familiar.
          </p>
          <div className="flex justify-center gap-8">
            <Link href="/produtos">
              <button className="border border-white rounded px-8 py-2 text-white hover:bg-white hover:text-[#8B6B3B] transition">
                Ver produtos
              </button>
            </Link>
            <Link href="/cadastro">
              <button className="border border-white rounded px-8 py-2 text-white hover:bg-white hover:text-[#8B6B3B] transition">
                Sou produtor
              </button>
            </Link>
          </div>
          <div className="mt-12 text-white text-4xl animate-bounce">↓</div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="bg-[#D9D9D9] py-12 px-6 flex-grow">
        <h2 className="text-center text-2xl font-semibold mb-10">Produtos em destaque</h2>
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 text-sm text-[#4B3A1B] justify-items-center">
          {produtos.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              Nenhum produto em destaque disponível no momento.
            </p>
          ) : (
            produtos.slice(0, 3).map((produto) => (
              <div
                key={produto.idOferta}
                className="bg-white rounded shadow p-6 flex flex-col items-center text-center min-h-[420px] w-full"
              >
                <h3 className="mb-2 text-lg font-bold">{produto.nomeProduto}</h3>
                <p className="mb-2 font-semibold">{produto.unidade}</p>
                <img
                  src={produto.fotoURL ? produto.fotoURL : "/imagens/placeholder.svg"}
                  alt={produto.nomeProduto}
                  className="w-40 h-40 object-cover rounded mb-4 border border-gray-300"
                />
                <p className="mb-3">{produto.descricao}</p>
                <p className="mb-1"><strong>Produtor:</strong> {produto.nomeProdutor}</p>
                <p className="mb-1"><strong>Propriedade:</strong> {produto.nomePropriedade}</p>
                <p className="mb-1">
                  <strong>Feira:</strong> {produto.localFeira} <br />
                  <span>{produto.dataFeira ? new Date(produto.dataFeira).toLocaleDateString() : '-'}</span>
                </p>
                <p className="mt-2 font-semibold">
                  {produto.precoEstimado ? `Preço: R$ ${produto.precoEstimado}` : 'Preço não informado'}
                </p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#8B6B3B] text-white text-sm py-6 px-8 flex flex-col md:flex-row justify-between items-center">
        <div className="flex gap-12">
          <p className="cursor-pointer hover:underline">Sobre a Feira</p>
          <p className="cursor-pointer hover:underline">Contato</p>
          <p className="cursor-pointer hover:underline">Créditos do projeto</p>
        </div>
        <div className="flex items-center gap-2 mt-4 md:mt-0">
          <img src="/imagens/instagram_icon.svg" alt="Instagram" className="h-5" />
          <span>@feiraagroecologicaufes</span>
        </div>
      </footer>
    </div>
  );
}
