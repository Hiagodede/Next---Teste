import Link from "next/link";
import Image from "next/image";

export default function HomePage() {
  return (
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
            href="/produtos" 
            className="rounded-xl bg-blac/60 border-2 px-8 py-4 text-xl font-semibold shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-orange-700 hover:border-0"
          >
            Conheça nossos produtos
          </Link>
        </div>
      </div>
    </section>
  );
}
