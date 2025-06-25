import "@/app/globals.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

export default function Term() {
  const router = useRouter();
  const [latestTerms, setLatestTerms] = useState<any[]>([]);
  const [latestVersionName, setLatestVersionName] = useState<string>("");
  const [versionIncremented, setVersionIncremented] = useState<boolean>(false);
  const [isModified, setIsModified] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [currentTerm, setCurrentTerm] = useState<any>(null);

  useEffect(() => {
    const fetchLatestTerms = async () => {
      try {
        const response = await axios.get("http://localhost:3200/term/latest-term");
        const { version, terms } = response.data;
        setLatestVersionName(version.name);
        setLatestTerms(terms);
      } catch (error) {
        console.error("Error fetching latest terms:", error);
        alert("Failed to fetch latest terms.");
      }
    };

    fetchLatestTerms();
  }, []);

  const incrementVersion = () => {
    if (!versionIncremented) {
      setLatestVersionName((prevVersion) => {
        const versionParts = prevVersion.split(".").map(Number);
        if (versionParts.length === 2) {
          versionParts[1] += 1;
        } else {
          versionParts.push(1);
        }
        return versionParts.join(".");
      });
      setVersionIncremented(true);
    }
  };

  const handleAddTerm = () => {
    incrementVersion();
    setIsModified(true);
    setLatestTerms((prevTerms) => [
      ...prevTerms,
      { id: Date.now().toString(), name: "", description: "", optional: false },
    ]);
  };

  const handleDeleteTerm = (id: string) => {
    incrementVersion();
    setIsModified(true);
    setLatestTerms((prevTerms) => prevTerms.filter((term) => term.id !== id));
  };

  const handleChange = (id: string, field: string, value: string | boolean) => {
    incrementVersion();
    setIsModified(true);
    setLatestTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === id ? { ...term, [field]: value } : term
      )
    );
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatestVersionName(e.target.value);
    setIsModified(true);
  };

  const handleOpenModal = (term: any) => {
    setCurrentTerm(term);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setCurrentTerm(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (currentTerm) {
      handleChange(currentTerm.id, "description", e.target.value);
    }
  };

  const handleSaveDescription = () => {
    if (currentTerm) {
      setLatestTerms((prevTerms) =>
        prevTerms.map((term) =>
          term.id === currentTerm.id ? { ...term, description: currentTerm.description } : term
        )
      );
      setIsModified(true);
      handleCloseModal();
    }
  };

  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token") || "";
  }

  const handleCreateVersion = async () => {
    try {
      // Create the new version
      const versionResponse = await axios.post(
        "http://localhost:3200/term/version",
        {
          version: latestVersionName,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const versionId = versionResponse.data.id;

      // Create all terms for the new version
      for (const term of latestTerms) {
        await axios.post(
          "http://localhost:3200/term/term",
          {
            name: term.name,
            description: term.description,
            versionId,
            optional: term.optional,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      }

      alert("Nova versão e termos criados com sucesso!");
      setIsModified(false);
    } catch (err) {
      const error = err as any;
      if (error.response && error.response.status === 403) {
        router.replace("/");
      } else {
        console.error("Error creating version and terms:", error);
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <label htmlFor="version" className="block text-lg font-bold mb-2">
          Versão:
        </label>
        <input
          id="version"
          type="text"
          value={latestVersionName}
          onChange={handleVersionChange}
          className="border border-gray-400 rounded-md p-2 w-full text-lg"
        />
      </div>
      <table className="table-auto border-collapse border border-gray-400 w-full text-left">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-400 p-4">Nome</th>
            <th className="border border-gray-400 p-4">Descrição</th>
            <th className="border border-gray-400 p-4">Opcional</th>
            <th className="border border-gray-400 p-4">Ações</th>
          </tr>
        </thead>
        <tbody>
          {latestTerms.map((term, index) => (
            <tr
              key={term.id}
              className={index % 2 === 0 ? "bg-gray-100" : "bg-white"}
            >
              <td className="border border-gray-400 p-4">
                <input
                  type="text"
                  value={term.name}
                  onChange={(e) => handleChange(term.id, "name", e.target.value)}
                  className="border border-gray-400 rounded-md p-2 w-full"
                />
              </td>
              <td className="border border-gray-400 p-4 text-center">
                <button
                  onClick={() => handleOpenModal(term)}
                  className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
                >
                  Editar Descrição
                </button>
              </td>
              <td className="border border-gray-400 p-4 text-center">
                <input
                  type="checkbox"
                  checked={term.optional}
                  onChange={(e) =>
                    handleChange(term.id, "optional", e.target.checked)
                  }
                  className="h-5 w-5"
                />
              </td>
              <td className="border border-gray-400 p-4 text-center">
                <button
                  onClick={() => handleDeleteTerm(term.id)}
                  className="bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600"
                >
                  Excluir
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        onClick={handleAddTerm}
        className="mt-6 bg-blue-500 text-white rounded-md px-6 py-3 hover:bg-blue-600"
      >
        Adicionar Termo
      </button>
      <button
        onClick={handleCreateVersion}
        disabled={!isModified}
        className={`mt-4 px-6 py-3 rounded-md text-white ${
          isModified
            ? "bg-green-500 hover:bg-green-600"
            : "bg-gray-400 cursor-not-allowed"
        }`}
      >
        Criar Nova Versão
      </button>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-md w-1/2">
            <h2 className="text-lg font-bold mb-4">Editar Descrição</h2>
            <textarea
              value={currentTerm?.description || ""}
              onChange={(e) =>
                setCurrentTerm((prev: any) => ({ ...prev, description: e.target.value }))
              }
              className="w-full h-40 border border-gray-400 rounded-md p-2"
            />
            <div className="mt-4 flex justify-end gap-4">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white rounded-md px-4 py-2 hover:bg-gray-600"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveDescription}
                className="bg-blue-500 text-white rounded-md px-4 py-2 hover:bg-blue-600"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
