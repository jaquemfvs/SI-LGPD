import "@/app/globals.css";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa"; // Ícone de usuário
import { IoMdMail } from "react-icons/io"; // Ícone de assinatura (Subscribe)
import { useEffect, useState } from "react"; // Import useEffect and useState
import axios from "axios"; // Import axios

// Define an interface for the user data
interface UserData {
  id: number;
  email: string;
  name?: string; // Assuming name might be optional or added later
  subscribedToNewsletter?: boolean;
  agreedToPromotionalEmails?: boolean;
  // Add other fields as necessary
}

export default function Newsletter() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData | null>(null); // State to store user data

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
          // Optionally, redirect to login if token is invalid or expired
          // router.push("/"); 
        }
      };
      fetchUserData();
    }
  }, [router]);

  const handleSettings = () => {
    router.push("/app/settings"); // Redireciona para a página de configurações
  };

  const handleSubscribe = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar logado para se inscrever.");
        return;
      }
      // Make the API call to subscribe
      await axios.put(
        "http://localhost:3200/user/subscription",
        { subscribed: true }, // Request body
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Inscrito na Newsletter com sucesso!");
      // Optionally, update local user data state if the API returns the updated user
      // Or re-fetch user data
      setUserData(prevData => prevData ? ({ ...prevData, subscribedToNewsletter: true }) : null);
    } catch (error) {
      console.error("Falha ao se inscrever na Newsletter:", error);
      alert("Ocorreu um erro ao tentar se inscrever na Newsletter.");
    }
  };

  return (
    <main className="w-full h-full bg-gray-900 flex flex-col items-center p-6 relative">
      {/* Botão de Subscribe no canto superior esquerdo */}
      <button
        onClick={handleSubscribe}
        disabled={userData?.subscribedToNewsletter} // Disable if already subscribed
        className="absolute top-4 left-4 text-white bg-transparent rounded-full p-2 hover:cursor-pointer hover:scale-105 transition-all active:scale-90 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <IoMdMail size={28} />
        <span className="text-sm">
          {userData?.subscribedToNewsletter ? "Inscrito" : "Subscribe to our Newsletter"}
        </span>
      </button>

      {/* Botão com ícone de usuário no canto superior direito */}
      <button
        onClick={handleSettings}
        className="absolute top-4 right-4 text-white bg-transparent rounded-full p-2 hover:cursor-pointer hover:scale-105 transition-all active:scale-90"
      >
        <FaUserCircle size={32} />
      </button>

      <h1 className="text-white text-3xl mb-6">
        Newsletter Tech News {userData?.email ? `- Olá, ${userData.email}!` : ""}
      </h1>

      {/* Grid de notícias em duas colunas */}
      <div className="grid grid-cols-2 gap-4 max-w-4xl">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="bg-white text-black p-6 rounded-md">
            <h2 className="text-xl font-bold">Notícia {index + 1}</h2>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Blanditiis iusto itaque quae eligendi amet illo a eos voluptatum et, nulla inventore nesciunt, aliquid debitis placeat neque ipsa, cumque fuga dolorum. {index + 1}...
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}