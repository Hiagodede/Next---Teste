
"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [ofertas, setOfertas] = useState<any[]>([]);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/ofertas')
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.message || 'Erro ao buscar ofertas');
        }
        return data;
      })
      .then((data) => {
        setOfertas(data);
      })
      .catch((err) => setErro(err.message));
  }, []);

  if (erro) {
    return <div>Erro: {erro}</div>;
  }

  return (
    <div>
      <section className="relative flex h-[calc(100vh-96px)] items-center justify-center text-center text-white">
        <Image
          src="/feirahome.svg"
          alt="Barraca da Feira Agroecológica da UFES com produtos frescos"
          fill
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/60" />

        <div className="relative z-10 flex flex-col items-center p-4">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Feira Agroecológica da UFES
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl lg:text-2xl">
            Produtos frescos e artesanais direto da agricultura familiar para você.
          </p>
          <div className="mt-8">
            <Link
              href="/catalogo"
              className="rounded-xl bg-blac/60 border-2 px-8 py-4 text-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-700 hover:border-0"
            >
              Conheça nossos produtos
            </Link>
          </div>
        </div>
      </section>
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 py-12 place-items-center">
        {ofertas.length === 0 ? (
          <p className="col-span-full text-center text-gray-500">
            Nenhuma oferta disponível no momento.
          </p>
        ) : (
          ofertas.map((oferta, idx) => (
            <div
              key={oferta.idoferta || idx}
              className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center min-h-[420px] w-[320px] justify-center transition-transform hover:scale-105"
            >
              <div className="flex items-center justify-center w-full mb-4">
                <img
                  src={oferta.fotourl ? (oferta.fotourl.startsWith('/') ? oferta.fotourl : `/${oferta.fotourl}`) : '/imagens/placeholder.svg'}
                  alt={oferta.nomeproduto}
                  className="w-44 h-44 object-contain rounded border border-gray-300 bg-gray-50"
                  style={{ maxWidth: '180px', maxHeight: '180px' }}
                  onError={e => { e.currentTarget.src = '/imagens/placeholder.svg'; }}
                />
              </div>
              <h3 className="mb-2 text-xl font-bold text-[#4B3A1B]">{oferta.nomeproduto}</h3>
              <p className="mb-2 font-semibold text-[#8B6B3B]">{oferta.unidade}</p>
              {oferta.nomeprodutor && (
                <p className="mb-1"><strong>Produtor:</strong> {oferta.nomeprodutor}</p>
              )}
              {oferta.local && oferta.datafeira && (
                <p className="mb-1">
                  <strong>Feira:</strong> {oferta.local} - {new Date(oferta.datafeira).toLocaleDateString()}
                </p>
              )}
              {oferta.precoestimado && (
                <p className="mb-1 font-semibold text-green-700">Preço: R$ {parseFloat(oferta.precoestimado).toFixed(2).replace('.', ',')}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
