import "@/app/globals.css";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa"; // Ícone de usuário
import { IoMdMail } from "react-icons/io"; // Ícone de assinatura (Subscribe)

export default function Newsletter() {
  const router = useRouter();

  const handleSettings = () => {
    router.push("/settings"); // Redireciona para a página de configurações
  };

  const handleSubscribe = () => {
    alert("Inscrito na Newsletter!"); // Aqui você pode implementar sua lógica de inscrição
  };

  return (
    <main className="w-full h-full bg-gray-900 flex flex-col items-center p-6 relative">
      {/* Botão de Subscribe no canto superior esquerdo */}
      <button
        onClick={handleSubscribe}
        className="absolute top-4 left-4 text-white bg-transparent rounded-full p-2 hover:cursor-pointer hover:scale-105 transition-all active:scale-90 flex items-center gap-2"
      >
        <IoMdMail size={28} />
        <span className="text-sm">Subscribe to our Newsletter</span>
      </button>

      {/* Botão com ícone de usuário no canto superior direito */}
      <button
        onClick={handleSettings}
        className="absolute top-4 right-4 text-white bg-transparent rounded-full p-2 hover:cursor-pointer hover:scale-105 transition-all active:scale-90"
      >
        <FaUserCircle size={32} />
      </button>

      <h1 className="text-white text-3xl mb-6">Newsletter Tech News</h1>

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