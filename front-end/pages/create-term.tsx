import { useEffect, useState } from "react";
import axios from "axios";

export default function Term() {
  const [latestTerms, setLatestTerms] = useState<any[]>([]);
  const [latestVersionName, setLatestVersionName] = useState<string>("");
  const [versionIncremented, setVersionIncremented] = useState<boolean>(false);

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
    setLatestTerms((prevTerms) => [
      ...prevTerms,
      { id: Date.now().toString(), name: "", description: "", optional: false },
    ]);
  };

  const handleDeleteTerm = (id: string) => {
    incrementVersion();
    setLatestTerms((prevTerms) => prevTerms.filter((term) => term.id !== id));
  };

  const handleChange = (id: string, field: string, value: string | boolean) => {
    incrementVersion();
    setLatestTerms((prevTerms) =>
      prevTerms.map((term) =>
        term.id === id ? { ...term, [field]: value } : term
      )
    );
  };

  const handleVersionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLatestVersionName(e.target.value);
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
              <td className="border border-gray-400 p-4">
                <input
                  type="text"
                  value={term.description}
                  onChange={(e) =>
                    handleChange(term.id, "description", e.target.value)
                  }
                  className="border border-gray-400 rounded-md p-2 w-full"
                />
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
    </div>
  );
}
