
export default function HomePage() {
  return (
    <div>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-800 to-yellow-600 text-white py-6 px-8 flex justify-between items-center">
        <div className="text-xl font-bold">UFES</div>
        <nav className="space-x-6">
          <a href="#" className="hover:underline">Home</a>
          <a href="#" className="hover:underline">Sobre a Feira</a>
          <a href="#" className="hover:underline">Produtos</a>
          <a href="#" className="hover:underline">Barracas</a>
          <a href="#" className="hover:underline">Login do produtor</a>
          <a href="#" className="hover:underline">Contato</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative h-[70vh] bg-cover bg-center" style={{ backgroundImage: 'url(/feira-bg.jpg)' }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-3xl md:text-5xl font-bold">Bem-vindo à Feira Agroecológica da UFES</h1>
          <p className="mt-4 text-lg md:text-xl">Explore produtos frescos e artesanais direto da agricultura familiar.</p>
          <div className="mt-6 flex space-x-4">
            <button className="bg-white text-black font-semibold py-2 px-4 rounded-full">Ver produtos</button>
            <button className="border border-white py-2 px-4 rounded-full">Sou produtor</button>
          </div>
        </div>
      </section>

      {/* Produtos em Destaque */}
      <section className="bg-gray-100 py-10 px-6 text-center">
        <h2 className="text-2xl font-semibold mb-6">Produtos em destaque</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {[
            { nome: 'Laranja Lima', preco: 'R$ 10,35 kg', barraca: 'Gabriel Tetzner', imagem: '/laranja.jpg' },
            { nome: 'Banana Prata', preco: 'R$ 7,68 kg', barraca: 'Sobanana', imagem: '/banana.jpg' },
            { nome: 'Pote de mel', preco: 'R$ 40 un', barraca: 'Mel & Cia', imagem: '/mel.jpg' },
            { nome: 'Tomate', preco: 'R$ 6,99 kg', barraca: 'Rubronegra', imagem: '/tomate.jpg' }
          ].map((produto, i) => (
            <div key={i} className="bg-white shadow rounded p-4">
              <img src={produto.imagem} alt={produto.nome} className="w-full h-40 object-cover rounded mb-2" />
              <h3 className="font-semibold text-lg">{produto.nome}</h3>
              <p className="text-sm text-gray-700">{produto.preco}</p>
              <p className="mt-1 text-sm">Barraca {produto.barraca}</p>
              <a href="#" className="text-blue-600 text-sm underline mt-1 inline-block">Ver detalhes do vendedor</a>
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