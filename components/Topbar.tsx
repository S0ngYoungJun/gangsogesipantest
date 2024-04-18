import styles from "@/styles/Topbar.module.scss"
import UserInfo from "@/components/UserInfo";
export default function Topbar(){
  return(
<div className={styles.main}>
<UserInfo />
</div>
)}