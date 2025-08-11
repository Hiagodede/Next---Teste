"use client";

import React from "react";
import Link from "next/link";
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export function Header() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
    const pathname = usePathname(); 

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            setIsLoggedIn(true);
        } else {
            setIsLoggedIn(false);
        }
    }, [pathname]); 

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        router.push('/'); 
    };

    return (
        <header className="bg-gradient-to-r from-orange-800 to-yellow-600 text-white py-6 px-8 flex justify-between items-center shadow-md">
            <h1 className="text-2xl font-bold">Feira Agroecológica UFES</h1>
            <nav className="flex items-center gap-4"> {/* Usei flex e gap para alinhar melhor os itens */}
                <Link href="/" className="hover:text-gray-200 transition-colors">
                    Início
                </Link>
                
                {/* 5. Renderização condicional que decide quais links mostrar */}
                {isLoggedIn ? (
                    <>
                        <Link href="/dashboard" className="hover:text-gray-200 transition-colors">
                            Meu Painel
                        </Link>
                        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition-colors">
                            Sair
                        </button>
                    </>
                ) : (
                    <Link href="/login" className="hover:text-gray-200 transition-colors">
                        Login
                    </Link>
                )}
            </nav>
        </header>
    );
}