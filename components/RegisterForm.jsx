"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUserExists = await fetch("api/userExists", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const { user } = await resUserExists.json();

      if (user) {
        setError("User already exists.");
        return;
      }

      const res = await fetch("api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      if (res.ok) {
        const form = e.target;
        form.reset();
        router.push("/");
      } else {
        console.log("User registration failed.");
      }
    } catch (error) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="p-5 border-t-4 border-blue-400 rounded-lg shadow-lg">
        <h1 className="my-4 text-xl font-bold">Create Admin</h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            onChange={(e) => setAdminID(e.target.value)}
            type="text"
            placeholder="Admin ID"
            required
          />
          <input
            onChange={(e) => setAdminName(e.target.value)}
            type="text"
            placeholder="Admin Name"
            required
          />
          <input
            onChange={(e) => setAdminService(e.target.value)}
            type="text"
            placeholder="Admin Service"
            required
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            required
          />
          <input
            onChange={(e) => setAdminLevel(parseInt(e.target.value))}
            type="number"
            min="9"
            max="10"
            placeholder="Admin Level"
            required
          />
          <button className="px-6 py-2 font-bold text-white bg-blue-600 cursor-pointer">
            Create Admin
          </button>

          {error && (
            <div className="px-3 py-1 mt-2 text-sm text-white bg-red-500 rounded-md w-fit">
              {error}
            </div>
          )}

          <Link className="mt-3 text-sm text-right" href={"/"}>
            Already have an account? <span className="underline">Login</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
