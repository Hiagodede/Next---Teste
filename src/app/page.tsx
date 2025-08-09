import Link from 'next/link'; // 1. Importe o componente Link

// ... o resto do seu código

export default async function HomePage() {
  return (
    <div>
      {/* Header */}
      <header className="bg-gradient-to-r from-orange-800 to-yellow-600 text-white py-6 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Feira Agroecológica UFES</h1>
        <nav>
          <Link href="/" className="mr-4">Início</Link> {/* Link para a página inicial */}
          <Link href="/cadastro">Cadastro</Link> {/* 2. Use o Link com o href correto */}
        </nav>
      </header>

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