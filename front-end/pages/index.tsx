import "@/app/globals.css";
import axios from "axios";
import Link from "next/link";
import router from "next/router";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState<string>();
  const [password, setPassword] = useState<string>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3200/user/login", {
        email,
        password,
      });

      if (response.data && response.data.token) {
        console.log("Received token:", response.data.token);
        localStorage.setItem("token", response.data.token);
        router.push("/app");
      } else {
        console.error("Login failed: Token not received from server.");

      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  return (
    <main className="w-full h-full bg-gray-900">
      <div className=" flex flex-col w-full h-full items-center justify-center ">
        <form className="gap-4 flex flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-5">
            <label htmlFor="password" className="text-white">
              E-mail
            </label>
            <input
              type="email"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-400 h-14 w-fit min-w-[20rem] rounded-md bg-white p-2 text-xl"
            />
            <label htmlFor="password" className="text-white">
              Senha
            </label>
            <input
              type="password"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-400 h-14 w-fit min-w-[20rem]  rounded-md bg-white p-2 text-xl"
            />
          </div>
          <div>
            <Link
              href={"/register"}
              className="text-blue-300 underline hover:text-blue-600"
            >
              Não tem registro?
            </Link>
          </div>
          <button
            type="submit"
            className="text-white flex justify-center items-center bg-blue-500 rounded-md h-14 w-fit min-w-[20rem] hover:cursor-pointer hover:scale-115 transition-all active:scale-90"
          >
            Logar
          </button>
        </form>
      </div>
    </main>
  );
}
