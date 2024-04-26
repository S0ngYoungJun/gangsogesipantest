"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterCompanyForm() {
  const [memberId, setMemberId] = useState("");
  const [password, setPassword] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [businessNumber, setBusinessNumber] = useState("");
  const [location, setLocation] = useState("");
  const [contact, setContact] = useState("");
  const [fax, setFax] = useState("");
  const [representativeName, setRepresentativeName] = useState("");
  const [department, setDepartment] = useState("");
  const [repContact, setRepContact] = useState("");
  const [repEmail, setRepEmail] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const handleSubmit = async (e : any) => {
    e.preventDefault();
    
    if (!memberId || !companyName || !password|| !businessNumber|| !representativeName || !repContact) {
      setError("All fields are necessary.");
      return;
    }

    try {
      const resUser = await fetch("/api/registerUser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ memberId, password }),
      });

      if (!resUser.ok) throw new Error("Failed to register user.");

      const resCorp = await fetch("/api/registerCorporation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          businessNumber,
          location,
          contact,
          fax,
          representativeName,
          department,
          repContact,
          repEmail,
        }),
      });

      if (!resCorp.ok) throw new Error("Failed to register corporation.");
      alert("Registration successful!");
      router.push("/dashbored"); // Redirect to dashboard or appropriate page
    } catch (err) {
      console.log("Error during registration: ", error);
    }
  };

  return (
    <div className="grid h-screen place-items-center">
      <div className="p-5 border-t-4 border-blue-500 rounded-lg shadow-lg">
        <h1 className="my-4 text-xl font-bold">Register Company</h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input onChange={(e) => setMemberId(e.target.value)} type="text" placeholder="아이디" required />
          <input onChange={(e) => setPassword(e.target.value)} type="password" placeholder="비밀번호" required />
          <input onChange={(e) => setCompanyName(e.target.value)} type="text" placeholder="회사명" required />
          <input onChange={(e) => setBusinessNumber(e.target.value)} type="text" placeholder="사업자 등록번호" required />
          <input onChange={(e) => setLocation(e.target.value)} type="text" placeholder="소재지" required />
          <input onChange={(e) => setContact(e.target.value)} type="text" placeholder="회사연락처" required />
          <input onChange={(e) => setFax(e.target.value)} type="text" placeholder="Fax" required />
          <input onChange={(e) => setRepresentativeName(e.target.value)} type="text" placeholder="담당자(대표자) 명" required />
          <input onChange={(e) => setDepartment(e.target.value)} type="text" placeholder="담당자 부서" required />
          <input onChange={(e) => setRepContact(e.target.value)} type="text" placeholder="담당자(대표자) 연락처" required />
          <input onChange={(e) => setRepEmail(e.target.value)} type="email" placeholder="담당자(대표자) E-Mail" required />
          <button className="px-6 py-2 font-bold text-white bg-blue-600 cursor-pointer">Register Company</button>
          {error && <p className="text-red-500">{error}</p>}
        </form>
      </div>
    </div>
  );
}
