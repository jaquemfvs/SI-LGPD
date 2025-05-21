import "@/app/globals.css";
import { useState } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa"; // Ícone de usuário

export default function UserSettings() {
  const router = useRouter();

  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = () => {
    alert("Informações atualizadas com sucesso!");
    // Aqui você pode adicionar lógica para enviar os dados ao backend
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("userData");
    router.push("/");
  };

  return (
    <main className="w-full h-full bg-gray-900 flex flex-col items-center p-6 relative">
      {/* Botão para voltar ao menu inicial */}
      <button
        onClick={() => router.push("/")}
        className="absolute top-4 left-4 text-white bg-transparent rounded-full p-2 hover:cursor-pointer hover:scale-105 transition-all active:scale-90 flex items-center gap-2"
      >
        <FaUserCircle size={32} />
        <span className="text-sm">Voltar</span>
      </button>

      <h1 className="text-white text-3xl mb-6">Configurações do Usuário</h1>

      {/* Área de formulário */}
      <div className="bg-white p-6 rounded-md max-w-md w-full">
        <label className="block mb-4">
          Nome Completo:
          <input
            type="text"
            name="fullName"
            value={userData.fullName}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
          />
        </label>

        <label className="block mb-4">
          Email:
          <input
            type="email"
            name="email"
            value={userData.email}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
          />
        </label>

        <button
          onClick={handleUpdate}
          className="w-full bg-blue-500 text-white p-2 rounded mt-4"
        >
          Atualizar Dados
        </button>
      </div>

      {/* Botão de logout no canto inferior direito */}
      <button
        onClick={handleLogout}
        className="absolute bottom-4 right-4 bg-red-500 text-white p-2 rounded hover:scale-105 transition-all active:scale-90"
      >
        Deslogar
      </button>
    </main>
  );
}