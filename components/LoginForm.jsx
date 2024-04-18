"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError("Invalid Credentials");
        return;
      }

      router.replace("dashbored");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="p-5 border-t-4 border-green-400 rounded-lg shadow-lg">
        <h1 className="my-4 text-xl font-bold">Login</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
          />
          <button className="px-6 py-2 font-bold text-white bg-green-600 cursor-pointer">
            Login
          </button>
          {error && (
            <div className="px-3 py-1 mt-2 text-sm text-white bg-red-500 rounded-md w-fit">
              {error}
            </div>
          )}

          <Link className="mt-3 text-sm text-right" href={"/register"}>
            Don`t have an account? <span className="underline">Register</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
