"use client";
import { useEffect, useState } from "react";
import Image from "next/image";

interface Oferta {
  idoferta: number;
  precoestimado: string;
  fotourl: string;
  nomeproduto: string;
  unidade: string;
  nomeprodutor: string;
  local: string;
  datafeira: string;
  idcategoria?: number;
}

interface Categoria {
  idcategoria: number;
  desccategoria: string;
}

export default function CatalogoPage() {
  const [ofertas, setOfertas] = useState<Oferta[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<string>("");
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ofertas?all=true")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao buscar ofertas");
        setOfertas(data);
      })
      .catch((err) => setErro(err.message));
    fetch("/api/categorias")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Erro ao buscar categorias");
        setCategorias(data);
      })
      .catch((err) => setErro(err.message));
  }, []);

  const ofertasFiltradas = categoriaSelecionada
    ? ofertas.filter((oferta) => oferta.idcategoria !== undefined && oferta.idcategoria.toString() === categoriaSelecionada)
    : ofertas;

  return (
    <div>
      <section className="relative flex h-[320px] items-center justify-center text-center text-white">
        <Image
          src="/feirahome.svg"
          alt="Vitrine da Feira Agroecológica da UFES"
          fill
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex flex-col items-center p-4">
          <h1 className="text-4xl font-bold tracking-tight">Vitrine de Ofertas</h1>
          <p className="mt-2 max-w-2xl text-lg">Veja todos os produtos disponíveis na feira e filtre por categoria.</p>
        </div>
      </section>
      <div className="max-w-6xl mx-auto py-8">
        <div className="mb-8 flex flex-col md:flex-row items-center gap-4 justify-center">
          <label htmlFor="categoria" className="font-semibold text-lg text-gray-700">Filtrar por categoria:</label>
          <select
            id="categoria"
            value={categoriaSelecionada}
            onChange={e => setCategoriaSelecionada(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 text-lg shadow-sm focus:border-orange-500 focus:ring-orange-500"
          >
            <option value="">Todas</option>
            {categorias.map(cat => (
              <option key={cat.idcategoria} value={cat.idcategoria}>{cat.desccategoria}</option>
            ))}
          </select>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 place-items-center">
          {erro ? (
            <p className="col-span-full text-center text-red-500">{erro}</p>
          ) : ofertasFiltradas.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">Nenhuma oferta encontrada.</p>
          ) : (
            ofertasFiltradas.map((oferta, idx) => (
              <div
                key={oferta.idoferta || idx}
                className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center min-h-[420px] w-[320px] justify-center transition-transform hover:scale-105"
              >
                <div className="flex items-center justify-center w-full mb-4">
                  <img
                    src={oferta.fotourl ? (oferta.fotourl.startsWith("/") ? oferta.fotourl : `/${oferta.fotourl}`) : "/imagens/placeholder.svg"}
                    alt={oferta.nomeproduto}
                    className="w-44 h-44 object-contain rounded border border-gray-300 bg-gray-50"
                    style={{ maxWidth: "180px", maxHeight: "180px" }}
                    onError={e => { e.currentTarget.src = "/imagens/placeholder.svg"; }}
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
                  <p className="mb-1 font-semibold text-green-700">Preço: R$ {parseFloat(oferta.precoestimado).toFixed(2).replace(".", ",")}</p>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
