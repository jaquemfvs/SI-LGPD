import "@/app/globals.css";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa"; // Ícone de usuário
import axios from "axios";

interface UserData {
  id: number;
  email: string;
  name?: string;
  subscribedToNewsletter?: boolean;
  agreedToPromotionalEmails?: boolean;
}

export default function UserSettings() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    id: 0,
    email: '',
    name: '',
    subscribedToNewsletter: false,
    agreedToPromotionalEmails: false,
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      // Fetch user data
      const fetchUserData = async () => {
        try {
          const response = await axios.get("http://localhost:3200/user/me", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setUserData(response.data);
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      };
      fetchUserData();
    }
  }, [router]);

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

  // Toggle promotional emails
  const handlePromotionalEmailsToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }
    try {
      const newValue = !userData.agreedToPromotionalEmails;
      await axios.put(
        `http://localhost:3200/user/promotionalEmails?permit=${newValue}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUserData({ ...userData, agreedToPromotionalEmails: newValue });
    } catch (error) {
      alert("Erro ao atualizar preferência de e-mails promocionais.");
    }
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
        onClick={() => router.push("/app")}
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
            name="name"
            value={userData.name || ''}
            onChange={handleChange}
            className="w-full p-2 border rounded mt-2"
          />
        </label>

        <label className="block mb-4">
          Email:
          <input
            type="email"
            name="email"
            value={userData.email || ''}
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


      {/* Legal and marketing options - outside the form */}
      <div className="flex flex-col gap-2 mb-4 mt-4 bg-white p-4 rounded-md max-w-md w-full">
        <div className="flex items-center">
          <input
            type="checkbox"
            id="promotionalEmails"
            checked={!!userData.agreedToPromotionalEmails}
            onChange={handlePromotionalEmailsToggle}
            className="mr-2"
          />
          <label htmlFor="promotionalEmails">Receber e-mails promocionais</label>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-green-600 font-bold text-lg">✔</span>
          <span>
            Aceito os&nbsp;
            <span className="text-blue-500 underline cursor-pointer" onClick={() => alert('Abrir Termos de Uso (implementar modal)')}>Termos de Uso</span>
          </span>
        </div>
        <div className="flex items-center">
          <span className="mr-2 text-green-600 font-bold text-lg">✔</span>
          <span>
            Aceito a&nbsp;
            <span className="text-blue-500 underline cursor-pointer" onClick={() => alert('Abrir Política de Privacidade (implementar modal)')}>Política de Privacidade</span>
          </span>
        </div>
        <button
          className="mt-4 w-full bg-gray-200 text-gray-800 p-2 rounded hover:bg-gray-300 transition-colors"
          onClick={() => alert('Alterar consentimento dos termos (implementar ação/modal)')}
        >
          Alterar consentimento dos termos
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