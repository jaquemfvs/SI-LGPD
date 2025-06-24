import "@/app/globals.css";
import { createRef, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { FaUserCircle } from "react-icons/fa"; // Ícone de usuário
import axios from "axios";
import ViewOnlyModal from "../../components/ViewOnlyModal";

interface UserData {
  id: number;
  email: string;
  name?: string;
  subscribedToNewsletter?: boolean;
}

interface Term {
  termId: number;
  termName: string;
  isOptional: boolean;
  lastModified: string;
  status: string;
}

export default function UserSettings() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    id: 0,
    email: "",
    name: "",
    subscribedToNewsletter: false,
  });

  const [terms, setTerms] = useState<Term[]>([]);
  const [version, setVersion] = useState<{ id: number; name: string }>({
    id: 0,
    name: "",
  });

  const emailRef = createRef<HTMLInputElement>();
  const nameRef = createRef<HTMLInputElement>();
  const oldPasswordRef = createRef<HTMLInputElement>();
  const newPasswordRef = createRef<HTMLInputElement>();
  const newPasswordRef1 = createRef<HTMLInputElement>();

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/");
    } else {
      const fetchTermsAndVersion = async () => {
        try {
          const response = await axios.get(
            `http://localhost:3200/term/user/latest-logs?userId=${userData.id}`
          );

          setVersion(response.data.version);
          setTerms(response.data.terms);
        } catch (error) {
          console.error("Failed to fetch terms and version:", error);
        }
      };

      fetchTermsAndVersion();
    }
  }, [router, userData.id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;

    const token = localStorage.getItem("token");

    console.log(name, email);
    const data = await axios.patch(`http://localhost:3200/user/${userData.id}`, {
      name: name,
      email: email
    },
  {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
    alert("Informações atualizadas com sucesso!");
  };

  const handleUpdatePassword = async () => {
  const oldPassword = oldPasswordRef.current?.value;
  const newPassword = newPasswordRef.current?.value;
  const newPassword1 = newPasswordRef1.current?.value;
  const token = localStorage.getItem("token");

  if (!oldPassword || !newPassword) {
    alert("Preencha os dois campos de senha.");
    return;
  }

  if (newPassword !== newPassword1) {
    alert("As novas senhas não coincidem.");
    return;
  }

  try {
    await axios.patch(
      `http://localhost:3200/user/${userData.id}`,
      {
        password: newPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert("Senha atualizada com sucesso!");
    if (oldPasswordRef.current) oldPasswordRef.current.value = "";
    if (newPasswordRef.current) newPasswordRef.current.value = "";
    if (newPasswordRef1.current) newPasswordRef1.current.value = "";
  } catch (error) {
    alert("Erro ao atualizar a senha.");
    console.error(error);
  }
};

  const handleOptionalTermChange = async (termId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token de autenticação ausente. Faça login novamente.");
      return;
    }

    try {
      const termToUpdate = terms.find((term) => term.termId === termId);
      if (!termToUpdate) {
        alert("Termo não encontrado.");
        return;
      }

      const newSignedStatus = termToUpdate.status === "Signed" ? false : true;
      const changeDate = new Date().toISOString();

      await axios.post(
        "http://localhost:3200/term/log",
        {
          userId: userData.id,
          changeDate,
          signed: newSignedStatus,
          termId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTermsResponse = await axios.get(
        `http://localhost:3200/term/user/latest-logs?userId=${userData.id}`
      );

      setTerms(updatedTermsResponse.data.terms);
      setVersion(updatedTermsResponse.data.version);

      alert("Termo opcional atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao modificar termo opcional:", error);
      alert("Erro ao modificar termo. Tente novamente.");
    }
  };

  const handleMandatoryTermAccept = async (termId: number) => {
    const token = localStorage.getItem("token");

    if (!token) {
      alert("Token de autenticação ausente. Faça login novamente.");
      return;
    }

    const confirmAccept = confirm(
      "Você tem certeza que deseja aceitar este termo obrigatório? Esta ação não poderá ser desfeita."
    );

    if (!confirmAccept) return;

    try {
      const changeDate = new Date().toISOString();

      await axios.post(
        "http://localhost:3200/term/log",
        {
          userId: userData.id,
          changeDate,
          signed: true,
          termId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedTermsResponse = await axios.get(
        `http://localhost:3200/term/user/latest-logs?userId=${userData.id}`
      );

      setTerms(updatedTermsResponse.data.terms);
      setVersion(updatedTermsResponse.data.version);

      alert("Termo obrigatório aceito com sucesso!");
    } catch (error) {
      console.error("Erro ao aceitar termo obrigatório:", error);
      alert("Erro ao aceitar termo. Tente novamente.");
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

      <div className="bg-white p-6 rounded-md max-w-4xl w-full flex flex-col md:flex-row gap-4">
  {/* Coluna 1 - Nome e Email */}
  <div className="w-full md:w-1/2">
    <label className="block mb-4">
      Nome Completo:
      <input
        type="text"
        name="name"
        value={userData.name || ""}
        onChange={handleChange}
        ref={nameRef}
        className="w-full p-2 border rounded mt-2"
      />
    </label>

    <label className="block mb-4">
      Email:
      <input
        type="email"
        name="email"
        value={userData.email || ""}
        onChange={handleChange}
        ref={emailRef}
        className="w-full p-2 border rounded mt-2"
      />
    </label>

    {/* Botão de atualizar dados */}
    <button
      onClick={handleUpdate}
      className="w-full bg-blue-500 text-white p-2 rounded mt-2"
    >
      Atualizar Dados
    </button>
  </div>

  {/* Coluna 2 - Senhas */}
  <div className="w-full md:w-1/2">
    <label className="block mb-4">
      Senha Antiga:
      <input
        type="password"
        name="oldPassword"
        ref={oldPasswordRef}
        className="w-full p-2 border rounded mt-2"
      />
    </label>

    <label className="block mb-4">
      Nova Senha:
      <input
        type="password"
        name="newPassword"
        ref={newPasswordRef}
        className="w-full p-2 border rounded mt-2"
      />
    </label>

    <label className="block mb-4">
      Confirme sua nova senha:
      <input
        type="password"
        name="newPassword"
        ref={newPasswordRef1}
        className="w-full p-2 border rounded mt-2"
      />
    </label>

    {/* Botão de atualizar senha */}
    <button
      onClick={handleUpdatePassword}
      className="w-full bg-green-600 text-white p-2 rounded mt-2"
    >
      Atualizar Senha
    </button>
  </div>
</div>
      <div className="flex flex-col gap-2 mb-4 mt-4 bg-white p-4 rounded-md max-w-md w-full">
        <div className="overflow-y-auto pr-4" style={{ maxHeight: '200px' }}>
          <h2 className="text-xl font-bold mb-1">Termos de Uso</h2>
          <p className="text-sm text-gray-500 mb-4">Versão: {version.name}</p>
          <ul className="list-disc pl-5">
            {terms.map((term) => (
              <li key={term.termId} className="mb-4">
                <div className="flex justify-between items-center gap-4">
                  <span className="flex-1">
                    <strong>{term.termName}</strong> -{" "}
                    {term.isOptional ? "Opcional" : "Obrigatório"}
                  </span>
                  {term.isOptional ? (
                    <input
                      type="checkbox"
                      checked={term.status === "Signed"}
                      onChange={() => handleOptionalTermChange(term.termId)}
                      className="ml-2"
                    />
                  ) : term.status === "Signed" ? (
                    <span>✔</span>
                  ) : (
                    <button
                      onClick={() => handleMandatoryTermAccept(term.termId)}
                      className="ml-2 bg-blue-500 text-white px-2 py-1 rounded"
                    >
                      Aceitar
                    </button>
                  )}
                </div>
                <p className="text-sm text-gray-600">
                  Última modificação: {" "}
                  {term.lastModified === "No changes made"
                    ? "Nenhuma alteração"
                    : new Date(term.lastModified).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <button
          onClick={async () => {
            const confirmDelete = confirm(
              "Tem certeza que deseja deletar sua conta? Essa ação é irreversível."
            );
            if (!confirmDelete) return;

            const token = localStorage.getItem("token");
            if (!token) {
              alert("Você precisa estar logado.");
              return;
            }

            try {
              await axios.put(
                "http://localhost:3200/user/deactivate",
                {},
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              alert("Conta deletada com sucesso.");
              localStorage.clear();
              document.cookie =
                "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
              router.push("/");
            } catch (error) {
              alert("Erro ao deletar a conta.");
              console.error(error);
            }
          }}
          className="mt-2 w-full bg-red-600 text-white p-2 rounded hover:bg-red-700 transition-colors"
        >
          Deletar minha conta
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
