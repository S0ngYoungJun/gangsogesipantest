import { AuthProvider } from "./Providers";
import "./globals.css";
import localFont from 'next/font/local'

const myFont = localFont({
  src: '../public/fonts/AppleSDGothicNeoEB.ttf',
  display: 'swap',
})

export const metadata = {
  title: "강소기업개발진흥원",
  description: "강소기업개발진흥원 관리자페이지",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={myFont.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
