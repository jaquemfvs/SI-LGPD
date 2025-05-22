import Link from "next/link";
import { useState, useEffect } from "react";
import TermsModal from "../components/TermsModal";
import axios from "axios";
import { useRouter } from "next/router";
import { HiArrowNarrowLeft } from "react-icons/hi";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [agreedToPromotionalEmails, setagreedToPromotionalEmails] = useState(false);
  const [privacyPolicyAccepted, setPrivacyPolicyAccepted] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3200/user/register", {
        email,
        password,
        agreedToPromotionalEmails
      });
      alert("Conta criada com sucesso!");
      router.push("/");
    } catch (error) {
      alert("Não foi possível registrar!");
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

  const handlePrivacyPolicyChange = () => {
    if (!privacyPolicyAccepted) {
      setIsTermsModalOpen(true);
    } else {
      setPrivacyPolicyAccepted(false);
    }
  };

  const handleAcceptTerms = () => {
    setPrivacyPolicyAccepted(true);
    setIsTermsModalOpen(false);
  };

  const handleDeclineTerms = () => {
    setPrivacyPolicyAccepted(false);
    setIsTermsModalOpen(false);
  };

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
              <div className="flex flex-row gap-5">
                <input
                  type="checkbox"
                  id="offers"
                  checked={agreedToPromotionalEmails}
                  onChange={() => setagreedToPromotionalEmails(!agreedToPromotionalEmails)}
                  className="ml-2"
                />
                <label htmlFor="offers">
                  Concordo em receber e-mails com novidades e ofertas.
                </label>
              </div>

              <div className="flex flex-row gap-5">
                <input
                  type="checkbox"
                  id="privacy_policy"
                  checked={privacyPolicyAccepted}
                  onChange={handlePrivacyPolicyChange}
                  className="ml-2"
                />
                <label htmlFor="privacy_policy" className="cursor-pointer">
                  Li e aceito os&nbsp;
                  <span
                    onClick={() => setIsTermsModalOpen(true)}
                    className="text-blue-300 underline hover:text-blue-600 cursor-pointer"
                  >
                    Termos de Condições e Política de Privacidade
                  </span>
                </label>
              </div>
            </div>
            {!privacyPolicyAccepted && (
              <div className="text-red-500 text-sm">
                Você deve aceitar a Política de Privacidade para continuar.
              </div>
            )}
            <div className="flex place-content-center">
              <button
                disabled={
                  !privacyPolicyAccepted ||
                  !name ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !passwordsMatch ||
                  !isEmailValid
                }
                type="submit"
                className={`text-white flex justify-center items-center rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90 ${
                  !privacyPolicyAccepted ||
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
      </div>
      <TermsModal
        isOpen={isTermsModalOpen}
        onClose={() => setIsTermsModalOpen(false)}
        onAccept={handleAcceptTerms}
        onDecline={handleDeclineTerms}
      />
    </main>
  );
}
