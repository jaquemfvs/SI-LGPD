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
  const [latestTerms, setLatestTerms] = useState<any[]>([]);
  const [latestVersionName, setLatestVersionName] = useState<string>("");
  const [termDetails, setTermDetails] = useState<{ name: string; description: string } | null>(null);

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
      const response = await axios.get(`http://localhost:3200/term/${termId}`);
      const { name, description } = response.data;
      setTermDetails({ name, description });
      alert(`Term details: ${name} - ${description}`);
    } catch (error) {
      console.error("Error fetching term details by ID:", error);
      alert("Failed to fetch term details by ID.");
    }
  };

  const handleFetchLatestTerms = async () => {
    try {
      const response = await axios.get("http://localhost:3200/term/latest-term");
      const { version, terms } = response.data;
      setLatestVersionName(version.name);
      setLatestTerms(terms);
      alert(`Latest Version: ${version.name}`);
    } catch (error) {
      console.error("Error fetching latest terms:", error);
      alert("Failed to fetch latest terms.");
    }
  };

  return (
    <main className="w-full h-full bg-gray-900">
      <div className="flex flex-col w-full h-full items-center justify-center">
        <div className="flex flex-col gap-8">
          <div className="gap-4 flex flex-col">
            <h2 className="text-white text-2xl">Latest Version</h2>
            <p className="text-white">{latestVersionName || "No version fetched yet."}</p>
          </div>

          <div className="gap-4 flex flex-col">
            <h2 className="text-white text-2xl">Term Details</h2>
            {termDetails ? (
              <div className="text-white">
                <p><strong>Name:</strong> {termDetails.name}</p>
                <p><strong>Description:</strong> {termDetails.description}</p>
              </div>
            ) : (
              <p className="text-white">No term details available.</p>
            )}
          </div>

          <form className="gap-4 flex flex-col" onSubmit={handleVersionSubmit}>
            <h2 className="text-white text-2xl">Create Version</h2>
            <table className="table-auto border-collapse border border-gray-400">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 text-white">Version</td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      id="version"
                      value={version}
                      onChange={(e) => setVersion(e.target.value)}
                      className="border border-gray-400 h-10 w-full rounded-md bg-white p-2 text-xl"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="submit"
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-10 w-full hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Create Version
            </button>
          </form>

          <form className="gap-4 flex flex-col" onSubmit={handleTermSubmit}>
            <h2 className="text-white text-2xl">Create Term</h2>
            <table className="table-auto border-collapse border border-gray-400">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 text-white">Term Name</td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      id="termName"
                      value={termName}
                      onChange={(e) => setTermName(e.target.value)}
                      className="border border-gray-400 h-10 w-full rounded-md bg-white p-2 text-xl"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-white">Description</td>
                  <td className="border border-gray-400 p-2">
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="border border-gray-400 h-20 w-full rounded-md bg-white p-2 text-xl"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-white">Optional</td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="checkbox"
                      id="optional"
                      checked={optional}
                      onChange={(e) => setOptional(e.target.checked)}
                      className="h-6 w-6"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border border-gray-400 p-2 text-white">Version ID</td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      id="versionId"
                      value={versionId}
                      onChange={(e) => setVersionId(e.target.value)}
                      className="border border-gray-400 h-10 w-full rounded-md bg-white p-2 text-xl"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="submit"
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-10 w-full hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Create Term
            </button>
          </form>

          <div className="gap-4 flex flex-col">
            <h2 className="text-white text-2xl">Fetch Term Details</h2>
            <table className="table-auto border-collapse border border-gray-400">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 text-white">Term ID</td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      id="termId"
                      value={termId}
                      onChange={(e) => setTermId(e.target.value)}
                      className="border border-gray-400 h-10 w-full rounded-md bg-white p-2 text-xl"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={handleFetchTermDetailsById}
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-10 w-full hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Fetch Term Details
            </button>
          </div>

          <div className="gap-4 flex flex-col">
            <h2 className="text-white text-2xl">Fetch Terms by Version ID</h2>
            <table className="table-auto border-collapse border border-gray-400">
              <tbody>
                <tr>
                  <td className="border border-gray-400 p-2 text-white">Version ID</td>
                  <td className="border border-gray-400 p-2">
                    <input
                      type="text"
                      id="versionId"
                      value={versionId}
                      onChange={(e) => setVersionId(e.target.value)}
                      className="border border-gray-400 h-10 w-full rounded-md bg-white p-2 text-xl"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
            <button
              type="button"
              onClick={handleFetchTermsByVersionId}
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-10 w-full hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Fetch Terms by Version ID
            </button>
          </div>

          <div className="gap-4 flex flex-col">
            <h2 className="text-white text-2xl">Fetch Latest Terms</h2>
            <button
              type="button"
              onClick={handleFetchLatestTerms}
              className="text-white flex justify-center items-center bg-blue-500 rounded-md h-10 w-full hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
            >
              Fetch Latest Terms
            </button>
          </div>

          <table className="table-auto border-collapse border border-gray-400 text-white">
            <thead>
              <tr>
                <th className="border border-gray-400 p-2">Name</th>
                <th className="border border-gray-400 p-2">Description</th>
                <th className="border border-gray-400 p-2">ID</th>
                <th className="border border-gray-400 p-2">Optional</th>
              </tr>
            </thead>
            <tbody>
              {latestTerms.map((term) => (
                <tr key={term.id}>
                  <td className="border border-gray-400 p-2">{term.name}</td>
                  <td className="border border-gray-400 p-2">{term.description}</td>
                  <td className="border border-gray-400 p-2">{term.id}</td>
                  <td className="border border-gray-400 p-2">{term.optional ? "Yes" : "No"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
