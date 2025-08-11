import Link from 'next/link';

type ProdutoDestaque = {
  idOferta: number;
  nomeProduto: string;
  precoEstimado: string;
  unidade: string;
  nomeBarraca: string;
  fotoURL: string;
  linkVendedor: string;
};

async function getProdutosDestaque(): Promise<ProdutoDestaque[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/produtos`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error('Falha ao buscar produtos em destaque');
  }

  const produtos = (await res.json()) as ProdutoDestaque[];

  return produtos.map((produto) => ({
    ...produto,
    precoEstimado: Number(produto.precoEstimado)
      .toFixed(2)
      .replace('.', ','),
    linkVendedor: `/barracas/${produto.idOferta}`,
  }));
}

export default async function HomePage() {
  let produtosDestaque: ProdutoDestaque[] = [];

  try {
    produtosDestaque = await getProdutosDestaque();
  } catch (error) {
    console.error(error);
    // Poderia exibir uma mensagem na UI, caso queira
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="bg-[#8B6B3B] text-white py-4 px-8 flex justify-between items-center">
        <div>
          <img src="/imagens/logo_ufes.svg" alt="UFES" className="h-12" />
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
          <Link href="/login" className="hover:underline border-r border-white pr-6">
            Login do produtor
          </Link>
          <Link href="/contato" className="hover:underline">
            Contato
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative bg-cover bg-center h-[400px] flex flex-col justify-center items-center text-center px-4"
        style={{ backgroundImage: "url('/imagens/banner_feira.jpg')" }}
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
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm text-[#4B3A1B]">
          {produtosDestaque.length === 0 ? (
            <p className="col-span-full text-center text-gray-500">
              Nenhum produto em destaque disponível no momento.
            </p>
          ) : (
            produtosDestaque.map((produto) => (
              <div
                key={produto.idOferta}
                className="bg-white rounded shadow p-4 flex flex-col items-center"
              >
                <h3 className="mb-1">{produto.nomeProduto}</h3>
                <p className="mb-2 font-semibold">
                  R$ {produto.precoEstimado} {produto.unidade}
                </p>
                <img
                  src={produto.fotoURL}
                  alt={produto.nomeProduto}
                  className="w-40 h-40 object-cover rounded mb-4 border border-gray-300"
                />
                <p className="mb-1">{produto.nomeBarraca}</p>
                <Link
                  href={produto.linkVendedor}
                  className="text-xs underline hover:text-[#8B6B3B]"
                >
                  Ver detalhes do vendedor
                </Link>
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
