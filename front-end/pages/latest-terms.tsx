import { useState, useEffect } from "react";
import axios from "axios";

export default function LatestTerms() {
  const [terms, setTerms] = useState<any[]>([]);
  const [selectedTerm, setSelectedTerm] = useState<any | null>(null);

  useEffect(() => {
    const fetchLatestTerms = async () => {
      try {
        const response = await axios.get("http://localhost:3200/term/latest-terms");
        setTerms(response.data);
      } catch (error) {
        console.error("Error fetching latest terms:", error);
        alert("Failed to fetch latest terms.");
      }
    };

    fetchLatestTerms();
  }, []);

  return (
    <main className="w-full h-full bg-gray-900">
      <div className="flex flex-col w-full h-full items-center justify-center">
        <h1 className="text-white text-3xl mb-8">Latest Terms</h1>
        <table className="table-auto border-collapse border border-gray-500 text-white">
          <thead>
            <tr>
              <th className="border border-gray-500 px-4 py-2">Name</th>
              <th className="border border-gray-500 px-4 py-2">Optional</th>
            </tr>
          </thead>
          <tbody>
            {terms.map((term) => (
              <tr key={term.id}>
                <td
                  className="border border-gray-500 px-4 py-2 cursor-pointer hover:bg-gray-700"
                  onClick={() => setSelectedTerm(term)}
                >
                  {term.name}
                </td>
                <td className="border border-gray-500 px-4 py-2">
                  {term.optional ? "Optional" : <span className="text-red-500">Mandatory</span>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedTerm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md">
              <h2 className="text-xl font-bold mb-4">{selectedTerm.name}</h2>
              <p className="mb-4">{selectedTerm.description}</p>
              <button
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-700"
                onClick={() => setSelectedTerm(null)}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
