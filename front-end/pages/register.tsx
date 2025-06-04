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
  // Renamed state for Terms and Conditions
  const [termsCondAccepted, setTermsCondAccepted] = useState(false);
  // New state for Privacy Policy specific acceptance
  const [privacyPolicySpecificAccepted, setPrivacyPolicySpecificAccepted] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  // Renamed state for modal visibility
  const [isPolicyModalOpen, setIsPolicyModalOpen] = useState(false);
  // New state to track which content the modal is for ('terms' or 'privacy')
  const [modalFocus, setModalFocus] = useState<'terms' | 'privacy' | null>(null);

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

  // Renamed handler for Terms and Conditions checkbox change
  const handleTermsCondChange = () => {
    if (!termsCondAccepted) {
      setModalFocus('terms');
      setIsPolicyModalOpen(true);
    } else {
      setTermsCondAccepted(false);
    }
  };

  // New handler for Privacy Policy specific checkbox change
  const handlePrivacyPolicySpecificChange = () => {
    if (!privacyPolicySpecificAccepted) {
      setModalFocus('privacy');
      setIsPolicyModalOpen(true);
    } else {
      setPrivacyPolicySpecificAccepted(false);
    }
  };

  // Renamed and updated modal accept handler
  const handleModalAccept = () => {
    if (modalFocus === 'terms') {
      setTermsCondAccepted(true);
    } else if (modalFocus === 'privacy') {
      setPrivacyPolicySpecificAccepted(true);
    }
    setIsPolicyModalOpen(false);
  };

  // Renamed and updated modal decline handler
  const handleModalDecline = () => {
    if (modalFocus === 'terms') {
      setTermsCondAccepted(false);
    } else if (modalFocus === 'privacy') {
      setPrivacyPolicySpecificAccepted(false);
    }
    setIsPolicyModalOpen(false);
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
                  id="terms_conditions" // Changed id for clarity
                  checked={termsCondAccepted}
                  onChange={handleTermsCondChange} // Updated handler
                  className="ml-2"
                />
                <label htmlFor="terms_conditions" className="cursor-pointer"> {/* Changed htmlFor for clarity */}
                  Li e aceito os&nbsp;
                  <span
                    onClick={() => {
                      setModalFocus('terms');
                      setIsPolicyModalOpen(true);
                    }} // Updated to set focus and open modal
                    className="text-blue-300 underline hover:text-blue-600 cursor-pointer"
                  >
                    Termos e Condições de Uso
                  </span>
                </label>
              </div>
              {/* New Checkbox for Privacy Policy */}
              <div className="flex flex-row gap-5">
                <input
                  type="checkbox"
                  id="privacy_policy_specific"
                  checked={privacyPolicySpecificAccepted}
                  onChange={handlePrivacyPolicySpecificChange}
                  className="ml-2"
                />
                <label htmlFor="privacy_policy_specific" className="cursor-pointer">
                  Li e aceito a&nbsp;
                  <span
                    onClick={() => {
                      setModalFocus('privacy');
                      setIsPolicyModalOpen(true);
                    }}
                    className="text-blue-300 underline hover:text-blue-600 cursor-pointer"
                  >
                    Política de Privacidade
                  </span>
                </label>
              </div>
            </div>
            {/* Updated error message for Terms and Conditions */}
            {!termsCondAccepted && (
              <div className="text-red-500 text-sm">
                Você deve aceitar os Termos e Condições de Uso para continuar.
              </div>
            )}
            {/* New error message for Privacy Policy */}
            {!privacyPolicySpecificAccepted && (
              <div className="text-red-500 text-sm">
                Você deve aceitar a Política de Privacidade para continuar.
              </div>
            )}
            <div className="flex place-content-center">
              <button
                disabled={ // Updated disabled condition
                  !termsCondAccepted ||
                  !privacyPolicySpecificAccepted || // Added new condition
                  !name ||
                  !email ||
                  !password ||
                  !confirmPassword ||
                  !passwordsMatch ||
                  !isEmailValid
                }
                type="submit"
                className={`text-white flex justify-center items-center rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90 ${
                  !termsCondAccepted ||
                  !privacyPolicySpecificAccepted || // Added new condition
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
        isOpen={isPolicyModalOpen} // Updated prop
        onClose={() => setIsPolicyModalOpen(false)} // Updated prop
        onAccept={handleModalAccept} // Updated prop
        onDecline={handleModalDecline} // Updated prop
        modalFocus={modalFocus!} // Pass the modalFocus state
      />
    </main>
  );
}
