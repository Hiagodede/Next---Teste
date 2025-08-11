import React from "react";
import Link from "next/link";

export function Header() {
    return (
        <header className="bg-gradient-to-r from-orange-800 to-yellow-600 text-white py-6 px-8 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">Feira Agroecológica UFES</h1>
            <nav>
                <Link href="/" className="mr-4 hover:text-gray-200 transition-colors">
                    Início
                </Link>
                <Link href="/login" className="hover:text-gray-200 transition-colors">
                    Login
                </Link>
            </nav>
        </header>
    );
}
