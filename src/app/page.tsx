import { getProdutosDestaque, getProximaFeira } from '@/lib/db';

export default async function HomePage() {
  const res = await fetch('http://localhost:3000/api/produtos', { cache: 'no-store' });
  const { produtos = [], feira = null, error } = await res.json();

  if (error) {
    return (
      <div className="p-8 text-red-700">
        <h1>Erro ao conectar ao banco de dados</h1>
        <pre>{error}</pre>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-800 to-yellow-600 text-white py-6 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Feira Agroecológica UFES</h1>
        <nav>
          <a href="#" className="mr-4">Início</a>
          <a href="#">Produtos</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section
        className="relative h-[70vh] bg-cover bg-center"
        style={{ backgroundImage: "url('/feirahome.svg')" }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <h2 className="text-3xl md:text-5xl font-bold drop-shadow-lg shadow-black">
            Bem-vindo à Feira Agroecológica da UFES
          </h2>
          <p className="mt-4 text-lg md:text-xl drop-shadow-lg shadow-black">
            {feira 
              ? `Próxima feira: ${new Date(feira.data).toLocaleDateString()} - ${feira.local}`
              : 'Explore produtos frescos e artesanais direto da agricultura familiar.'}
          </p>
          <div className="mt-6 flex space-x-4">
            <button className="bg-white text-black font-semibold py-2 px-4 rounded-full drop-shadow-lg shadow-black">
              Ver produtos
            </button>
            <button className="border border-white py-2 px-4 rounded-full drop-shadow-lg shadow-black">
              Sou produtor
            </button>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="bg-gray-100 py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">Produtos em destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {produtos.map((produto) => (
            <div key={produto.idOferta} className="bg-white shadow rounded p-4">
              <img 
                src={produto.fotoURL} 
                alt={produto.nomeProduto} 
                className="w-full h-40 object-cover rounded mb-2" 
              />
              <h3 className="font-semibold text-lg">{produto.nomeProduto}</h3>
              <p className="text-sm text-gray-700">{produto.descricao}</p>
              <p className="mt-1 text-sm">Produtor: {produto.nomeProdutor}</p>
              <p className="mt-1 text-sm">Propriedade: {produto.nomePropriedade}</p>
              <a href="#" className="text-blue-600 text-sm underline mt-1 inline-block">
                Ver detalhes do vendedor
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-orange-800 to-yellow-600 text-white text-sm py-4 px-6 flex flex-col md:flex-row justify-between items-center">
        <p>Sobre a Feira</p>
        <p>Contato</p>
        <p>Créditos do projeto</p>
        <p>@feiraagroecologicaufes</p>
      </footer>
    </div>
  );
}