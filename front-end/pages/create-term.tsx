import { useState } from "react";
import axios from "axios";

export default function Term() {
  const [version, setVersion] = useState<string>("");
  const [termName, setTermName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [optional, setOptional] = useState<boolean>(false);
  const [versionId, setVersionId] = useState<string>("");
  const [termId, setTermId] = useState<string>("");
  const [versionTerms, setVersionTerms] = useState<any[]>([]);

  const handleVersionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const versionResponse = await axios.post("http://localhost:3200/term/version", {
        version,
      });

      alert("Version created successfully!");
    } catch (error) {
      console.error("Error creating version:", error);
      alert("Failed to create version.");
    }
  };

  const handleTermSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3200/term/term", {
        name: termName,
        description,
        versionId,
        optional,
      });

      alert("Term created successfully!");
    } catch (error) {
      console.error("Error creating term:", error);
      alert("Failed to create term.");
    }
  };

  const handleFetchTermsByVersionId = async () => {
    try {
      const response = await axios.get(`http://localhost:3200/term/version/${versionId}`);
      const termsWithDetails = response.data.map((term: { id: string; name: string; description: string; optional: boolean }) => ({
        id: term.id,
        name: term.name,
        description: term.description,
        optional: term.optional,
      }));
      setVersionTerms(termsWithDetails);
    } catch (error) {
      console.error("Error fetching terms by version ID:", error);
      alert("Failed to fetch terms by version ID.");
    }
  };

  const handleFetchTermDetailsById = async () => {
    try {
      const response = await axios.get(`http://localhost:3200/${termId}`);
      alert(`Term details: ${response.data.name} - ${response.data.description}`);
    } catch (error) {
      console.error("Error fetching term details by ID:", error);
      alert("Failed to fetch term details by ID.");
    }
  };

  return (
    <main className="w-full h-full bg-gray-900">
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex flex-col gap-8">
          <form className="gap-4 flex flex-col" onSubmit={handleVersionSubmit}>
            <h2 className="text-white text-2xl">Create Version</h2>
            <div className="flex flex-col gap-5">
              <label htmlFor="version" className="text-white">
                Version
              </label>
              <input
                type="text"
                id="version"
                value={version}
                onChange={(e) => setVersion(e.target.value)}
                className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white p-2 text-xl"
              />
            </div>
            <button
              type="submit"
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Create Version
            </button>
          </form>

          <form className="gap-4 flex flex-col" onSubmit={handleTermSubmit}>
            <h2 className="text-white text-2xl">Create Term</h2>
            <div className="flex flex-col gap-5">
              <label htmlFor="termName" className="text-white">
                Term Name
              </label>
              <input
                type="text"
                id="termName"
                value={termName}
                onChange={(e) => setTermName(e.target.value)}
                className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white p-2 text-xl"
              />

              <label htmlFor="description" className="text-white">
                Description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border border-gray-400 h-32 w-fit min-w-[20rem] rounded-md bg-white p-2 text-xl"
              />

              <div className="flex flex-col gap-5">
                <label htmlFor="optional" className="text-white">
                  Optional
                </label>
                <input
                  type="checkbox"
                  id="optional"
                  checked={optional}
                  onChange={(e) => setOptional(e.target.checked)}
                  className="h-6 w-6"
                />
              </div>

              <div className="flex flex-col gap-5">
                <label htmlFor="versionId" className="text-white">
                  Version ID
                </label>
                <input
                  type="text"
                  id="versionId"
                  value={versionId}
                  onChange={(e) => setVersionId(e.target.value)}
                  className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white p-2 text-xl"
                />
              </div>
            </div>
            <button
              type="submit"
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Create Term
            </button>
          </form>

          <div className="flex flex-col gap-5">
            <label htmlFor="termId" className="text-white">
              Term ID
            </label>
            <input
              type="text"
              id="termId"
              value={termId}
              onChange={(e) => setTermId(e.target.value)}
              className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white p-2 text-xl"
            />
            <button
              type="button"
              onClick={handleFetchTermDetailsById}
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Fetch Term Details
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <label htmlFor="versionId" className="text-white">
              Version ID
            </label>
            <input
              type="text"
              id="versionId"
              value={versionId}
              onChange={(e) => setVersionId(e.target.value)}
              className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white p-2 text-xl"
            />
            <button
              type="button"
              onClick={handleFetchTermsByVersionId}
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Fetch Terms by Version ID
            </button>
          </div>

          <ul className="text-white">
            {versionTerms.map((term) => (
              <li key={term.id} className="border border-gray-400 rounded-md p-2 mb-2">
                <strong>{term.name}</strong>: {term.description} <br />
                <span>ID: {term.id}</span> <br />
                <span>Optional: {term.optional ? "Yes" : "No"}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}
