import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [agreedToPromotionalEmails, setagreedToPromotionalEmails] =
    useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [latestTerms, setLatestTerms] = useState<any[]>([]);
  const [acceptedTerms, setAcceptedTerms] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [selectedTerm, setSelectedTerm] = useState<{ name: string; description: string } | null>(null);
  const [latestVersionName, setLatestVersionName] = useState<string>("");
  const [acceptedTermsLog, setAcceptedTermsLog] = useState<{ termId: string; acceptedAt: Date }[]>([]);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!areMandatoryTermsAccepted) {
      alert("Você deve aceitar todos os termos obrigatórios para continuar.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3200/user/register", {
        name,
        email,
        password,
        agreedToPromotionalEmails,
      });

      const userId = response.data.userId;

      if (!userId) {
        throw new Error("User ID not returned from registration.");
      }

      await Promise.all(
        acceptedTermsLog.map((log) =>
          axios.post("http://localhost:3200/term/log", {
            userId,
            changeDate: log.acceptedAt,
            signed: true,
            termId: log.termId,
          })
        )
      );

      alert("Conta criada com sucesso!");
      router.push("/");
    } catch (error) {
      console.error("Error during registration or logging terms:", error);
      alert("Não foi possível registrar ou salvar os logs dos termos!");
    }
  };

  useEffect(() => {
    if (password && confirmPassword) {
      setPasswordsMatch(password === confirmPassword);
    } else {
      setPasswordsMatch(true);
    }
  }, [password, confirmPassword]);

  useEffect(() => {
    if (email === "") {
      setIsEmailValid(true);
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setIsEmailValid(emailRegex.test(email));
  }, [email]);

  useEffect(() => {
    const fetchLatestTerms = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3200/term/latest-term"
        );
        const { version, terms } = response.data;
        setLatestVersionName(version.name);
        setLatestTerms(terms);

        const initialAcceptedTerms: { [key: string]: boolean } = {};
        terms.forEach((term: { id: string }) => {
          initialAcceptedTerms[term.id] = false;
        });
        setAcceptedTerms(initialAcceptedTerms);
      } catch (error) {
        console.error("Error fetching latest terms:", error);
      }
    };

    fetchLatestTerms();
  }, []);

  const handleTermChange = (termId: string) => {
    if (!selectedTerm) {
      setAcceptedTerms((prev) => {
        const isAccepted = !prev[termId];

        if (isAccepted) {
          setAcceptedTermsLog((log) => [
            ...log,
            { termId, acceptedAt: new Date() },
          ]);
        } else {
          setAcceptedTermsLog((log) => log.filter((entry) => entry.termId !== termId));
        }

        return {
          ...prev,
          [termId]: isAccepted,
        };
      });
    }
  };

  const handleTermClick = (term: { name: string; description: string }) => {
    setSelectedTerm(term);
  };

  const closeModal = () => {
    setSelectedTerm(null);
  };

  const areMandatoryTermsAccepted = latestTerms.every(
    (term) => term.optional || acceptedTerms[term.id]
  );

  return (
    <main className="w-full bg-gray-900 h-full flex">
      <div className=" flex flex-col w-full h-full items-center justify-center ">
        <div className="flex place-content-start items-start pr-[40%] pb-5">
          <a
            className="text-white hover:cursor-pointer content-start place-content-start hover:scale-150 transition-all"
            href="/"
          >
            <HiArrowNarrowLeft size={30} />
          </a>
        </div>
        <form onSubmit={handleSubmit} className="gap-4 flex flex-col">
          <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-white">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white p-2  text-xl"
                />

                <label htmlFor="email" className="text-white">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`border h-14 w-fit min-w-[20rem] rounded-md bg-white p-2  text-xl ${
                    isEmailValid || email === ""
                      ? "border-gray-400"
                      : "border-red-500"
                  }`}
                />
                {!isEmailValid && email !== "" && (
                  <div className="text-red-500 text-sm">
                    Formato de e-mail inválido.
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-white">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-400 h-14 w-fit min-w-[20rem]  p-2  text-xl rounded-md bg-white"
                />
                <label htmlFor="password_confirm" className="text-white">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="password_confirm"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={`border h-14 w-fit min-w-[20rem] rounded-md bg-white p-2  text-xl ${
                    passwordsMatch ? "border-gray-400" : "border-red-500"
                  }`}
                />
                {!passwordsMatch && (
                  <div className="text-red-500 text-sm">
                    As senhas não coincidem.
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-5 content-start start-1 text-white wrap-normal">
              <h2 className="text-white text-2xl">Termos e Condições</h2>
              {latestVersionName && (
                <p className="text-sm text-gray-400">Versão: {latestVersionName}</p>
              )}
              <div className="overflow-y-auto pr-4" style={{ maxHeight: '200px' }}>
                {latestTerms.map((term) => (
                  <div key={term.id} className="flex flex-row gap-5 mb-2">
                    <input
                      type="checkbox"
                      id={`term_${term.id}`}
                      checked={acceptedTerms[term.id] || false}
                      onChange={() => handleTermChange(term.id)}
                      className="ml-2"
                    />
                    <label
                      htmlFor={`term_${term.id}`}
                      className="cursor-pointer text-blue-300 underline hover:text-blue-600"
                      onClick={() => handleTermClick(term)}
                    >
                      {term.name} {term.optional ? "(Opcional)" : "(Obrigatório)"}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {!areMandatoryTermsAccepted && (
              <div className="text-red-500 text-sm">
                Você deve aceitar todos os termos obrigatórios para continuar.
              </div>
            )}

            <div className="flex place-content-center">
              <button
                disabled={
                  !areMandatoryTermsAccepted ||
                  !name ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !passwordsMatch ||
                  !isEmailValid
                }
                type="submit"
                className={`text-white flex justify-center items-center rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90 ${
                  !areMandatoryTermsAccepted ||
                  !name ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !passwordsMatch ||
                  !isEmailValid
                    ? "bg-gray-400"
                    : "bg-blue-500"
                }`}
              >
                Registrar
              </button>
            </div>
          </div>
        </form>

        {selectedTerm && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-6 rounded-md shadow-md w-1/2">
              <h2 className="text-xl font-bold mb-4">{selectedTerm.name}</h2>
              <p className="mb-4">{selectedTerm.description}</p>
              <button
                onClick={closeModal}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
