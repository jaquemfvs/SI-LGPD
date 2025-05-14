import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Login:", email, password);
    // Aqui você pode fazer a chamada para autenticar o usuário
  };

  const handleDelete = () => {
    if (confirm("Tem certeza que deseja cancelar sua assinatura?")) {
      console.log("Assinatura cancelada para:", email);
      // Aqui você pode chamar uma API para deletar a conta
    }
  };

  return (
    <main className="w-full min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="bg-gray-800 p-10 rounded-xl shadow-lg flex flex-col items-center gap-6">
        <h1 className="text-3xl text-white font-bold">TechLetter 🚀</h1>
        <p className="text-center text-gray-300">
          Receba novidades sobre tecnologia e inovação diretamente no seu e-mail!
        </p>

        <form className="flex flex-col gap-4 w-full max-w-md" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-white">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              required
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="border border-gray-400 h-12 rounded-md px-4 bg-white"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="password" className="text-white">
              Senha
            </label>
            <input
              type="password"
              id="password"
              required
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="border border-gray-400 h-12 rounded-md px-4 bg-white"
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white h-12 rounded-md hover:bg-blue-700 transition"
          >
            Entrar
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white h-12 rounded-md hover:bg-red-700 transition"
          >
            Cancelar Assinatura
          </button>

          <Link href="/register" className="text-blue-300 underline text-sm hover:text-blue-500">
            Ainda não tem conta? Cadastre-se
          </Link>
        </form>
      </div>
    </main>
  );
}