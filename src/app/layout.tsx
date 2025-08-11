import React from "react";
import "./globals.css";
import { Header } from '../components/Header';
import { Footer } from  '../components/Footer';

export const metadata = {
  title: 'Feira Agroecológica UFES',
  description: 'Compre produtos frescos e apoie a agricultura local.',
};

export default function RootLayout({ children } : { children: React.ReactNode }) {
  return (
    <html lang="pt-br">
      <body className="flex flex-col min-h-screen">
        <Header /> 
        <main className="flex-1">
          {children} 
        </main>
        <Footer />
      </body>
    </html>
  );
}
