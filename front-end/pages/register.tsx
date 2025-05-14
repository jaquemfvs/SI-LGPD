import Link from "next/link";

export default function Register() {
  return (
    <main className="w-full bg-gray-900 h-full flex">
      <div className=" flex flex-col w-full h-full items-center justify-center ">
        <form className="gap-4 flex flex-col">
          <div className="flex flex-col gap-5">
            <div className="flex flex-row gap-5">
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-white">
                  Nome
                </label>
                <input
                  type="text"
                  id="name"
                  className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white"
                />

                <label htmlFor="email" className="text-white">
                  E-mail
                </label>
                <input
                  type="email"
                  id="email"
                  className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-white">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  className="border border-gray-400 h-14 w-fit min-w-[20rem]  rounded-md bg-white"
                />
                <label htmlFor="password_confirm" className="text-white">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  id="password_confirm"
                  className="border border-gray-400 h-14 w-fit min-w-[20rem]  rounded-md bg-white"
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 content-start start-1 text-white wrap-normal">
              <div className="flex flex-row gap-5">
                <input type="checkbox" id="offers" />
                <label htmlFor="offers">
                  Concordo em receber e-mails com novidades e ofertas.
                </label>
              </div>

              <div className="flex flex-row gap-5">
                <input type="checkbox" id="newsletter" />
                <label htmlFor="newsletter">
                  Concordo em receber a newsletter.
                </label>
              </div>

              <div className="flex flex-row gap-5">
                <input type="checkbox" id="privacy_policy" />
                <label htmlFor="privacy_policy">
                  Li e aceito a&nbsp;
                  <Link
                    href={"https://example.com/privacy"}
                    className="text-blue-300 underline hover:text-blue-600"
                  >
                    Política de Privacidade
                  </Link>
                </label>
              </div>
            </div>
            <div className="flex place-content-center">
              <button
                disabled={true}
                type="submit"
                className="text-white flex justify-center items-center bg-blue-500 rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
              >
                Registrar
              </button>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}
