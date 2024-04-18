"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import styles from '@/styles/LoginForm.module.scss'; 

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
    <div className={styles.container}>
      <div className={styles.section1}>
        <div className={styles.title}>강소 관리자 사이트</div>
        <div className={styles.formContainer}>
          <h1 className={styles.logintitle}>Login</h1>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="text"
              placeholder="Email"
              className={styles.input}
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className={styles.input}
            />
            <button className={styles.button}>
              Login
            </button>
            {error && (
              <div className={styles.error}>
                {error}
              </div>
            )}

            <Link href={"/register"} className={styles.registerLink}>
              Don`t have an account? <span className={styles.underline}>Register</span>
            </Link>
          </form>
        </div>
      </div>
    <div className={styles.section2}>

    </div>
  </div>
);
}