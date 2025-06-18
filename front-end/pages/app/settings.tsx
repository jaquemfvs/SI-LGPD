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
  agreedToPromotionalEmails?: boolean;
  termsOfUseVersionAccepted?: string;
  termsOfUseLastUpdatedAt?: string;
  privacyPolicyVersionAccepted?: string;
  privacyPolicyLastUpdatedAt?: string;
  promotionalEmailsLastUpdatedAt?: string;
}

export default function UserSettings() {
  const router = useRouter();

  const [userData, setUserData] = useState<UserData>({
    id: 0,
    email: "",
    name: "",
    subscribedToNewsletter: false,
    agreedToPromotionalEmails: false,
    termsOfUseVersionAccepted: "",
    termsOfUseLastUpdatedAt: "",
    privacyPolicyVersionAccepted: "",
    privacyPolicyLastUpdatedAt: "",
    promotionalEmailsLastUpdatedAt: "",
  });

  const [isViewOnlyModalOpen, setIsViewOnlyModalOpen] = useState(false);
  const [viewOnlyModalFocus, setViewOnlyModalFocus] = useState<"terms" | "privacy" | null>(null);
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


  const handlePromotionalEmailsToggle = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Você precisa estar logado.");
      return;
    }
    try {
      const newValue = !userData.agreedToPromotionalEmails;
      const currentTime = new Date();
      await axios.put(
        `http://localhost:3200/user/promotionalEmails?permit=${newValue}&updatedAt=${currentTime.toISOString()}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Fetch updated user data
      const response = await axios.get("http://localhost:3200/user/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (error) {
      alert("Erro ao atualizar preferência de e-mails promocionais.");
    }
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    localStorage.removeItem("userData");
    router.push("/");
  };

  const openViewOnlyModal = (focus: "terms" | "privacy") => {
    setViewOnlyModalFocus(focus);
    setIsViewOnlyModalOpen(true);
  };

  const closeViewOnlyModal = () => {
    setIsViewOnlyModalOpen(false);
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
          <label htmlFor="promotionalEmails">
            Receber e-mails promocionais
          </label>
        </div>
        <div className="flex flex-col">
          <span>
            Termos de Uso:
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={() => openViewOnlyModal("terms")}
            >
              {userData.termsOfUseVersionAccepted
                ? ` Versão ${userData.termsOfUseVersionAccepted}`
                : " Não aceito"}
            </span>
          </span>
          <span className="text-gray-600">
            {userData.termsOfUseLastUpdatedAt
              ? `Termo aceitado em: ${new Date(
                  userData.termsOfUseLastUpdatedAt
                ).toLocaleString()}`
              : "Termo recusado em: Não disponível"}
          </span>
        </div>
        <div className="flex flex-col">
          <span>
            Política de Privacidade:
            <span
              className="text-blue-500 underline cursor-pointer"
              onClick={() => openViewOnlyModal("privacy")}
            >
              {userData.privacyPolicyVersionAccepted
                ? ` Versão ${userData.privacyPolicyVersionAccepted}`
                : " Não aceito"}
            </span>
          </span>
          <span className="text-gray-600">
            {userData.privacyPolicyLastUpdatedAt
              ? `Termo aceitado em: ${new Date(
                  userData.privacyPolicyLastUpdatedAt
                ).toLocaleString()}`
              : "Termo recusado em: Não disponível"}
          </span>
        </div>
        <div className="flex flex-col">
          <span>
            E-mails Promocionais:
            <span className="text-gray-600">
              {userData.agreedToPromotionalEmails ? " Aceito" : " Não aceito"}
            </span>
          </span>
          <span className="text-gray-600">
            {userData.promotionalEmailsLastUpdatedAt
              ? userData.agreedToPromotionalEmails
                ? `Termo aceitado em: ${new Date(
                    userData.promotionalEmailsLastUpdatedAt
                  ).toLocaleString()}`
                : `Termo recusado em: ${new Date(
                    userData.promotionalEmailsLastUpdatedAt
                  ).toLocaleString()}`
              : "Não disponível"}
          </span>
        </div>
        {/* Botão de deletar conta */}
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

      <ViewOnlyModal
        isOpen={isViewOnlyModalOpen}
        onClose={closeViewOnlyModal}
        modalFocus={viewOnlyModalFocus!}
      />
    </main>
  );
}
