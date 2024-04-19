"use client";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import styles from '@/styles/UseInfo.module.scss'; // Import the SCSS module

export default function UserInfo() {
  const { data: session } = useSession();

  return (
    <div className={styles.container}>
      <div className={styles.userCard}>
        <div>
          <span className={styles.userName}>{session?.user?.name}, 반갑다</span>
        </div>
        <button
          onClick={() => signOut()}
          className={styles.logoutButton}
        >
          Log Out
        </button>
      </div>
    </div>
  );
}
