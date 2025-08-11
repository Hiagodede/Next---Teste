import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-gradient-to-r from-orange-800 to-yellow-600 text-white py-4 px-6 flex flex-row justify-center gap-8">
      <Link href={"/sobre"} className="hover:text-gray-200 transition-colors">
        Sobre a Feira
      </Link>

      <Link href={"/contato"} className="hover:text-gray-200 transition-colors">
        Contato
      </Link>

      <a
        target="_blank"
        rel="noopener noreferrer"
        href={"https://www.instagram.com/feiraagroecologicaufes/"}
        className="hover:text-gray-200 transition-colors"
      >
        @feiraagroecologicaufes
      </a>
    </footer>
  );
}
