/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */
"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import PageTitle from "@/components/PageTitle";

type Props = {};
type Payment = {
  NO:string;
  아이디: string;
  영업담당자명: string;
  영업담당자연락처: string;
  영업담당자이메일: string;
  회원사수:number;
  등록일:Date;
};

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "NO",
    header: "no.",
  },
  {
    accessorKey: "아이디",
    header: "아이디.",
  },
  {
    accessorKey: "영업담당자명",
    header: "영업 담당자명",
  },
  {
    accessorKey: "영업담당자연락처",
    header: "영업 담당자 연락처",
  },
  {
    accessorKey: "영업담당자이메일",
    header: "Email"
  },
  {
    accessorKey: "회원사수",
    header: "회원사 수"
  },
  {
    accessorKey: "등록일",
    header: "등록일",
    cell: ({ row }) => {
      const date = row.getValue("등록일") as Date;
      return <span>{date.toLocaleDateString()}</span>;
    }
  },
];

const data: Payment[] = [
  {
    NO: "1",
    아이디: "john@example.com",
    영업담당자명: "차은우",
    영업담당자연락처: "010-0000-0001",
    영업담당자이메일: "john@example.com",
    회원사수: 100,
    등록일: new Date("2023-01-01")
  },
  {
    NO: "2",
    아이디: "alice@example.com",
    영업담당자명: "이나영",
    영업담당자연락처: "010-0000-0002",
    영업담당자이메일: "alice@example.com",
    회원사수: 150,
    등록일: new Date("2023-02-15")
  },
  {
    NO: "3",
    아이디: "bob@example.com",
    영업담당자명: "최수종",
    영업담당자연락처: "010-0000-0003",
    영업담당자이메일: "bob@example.com",
    회원사수: 200,
    등록일: new Date("2023-03-20")
  },
  {
    NO: "4",
    아이디: "bob@example.com",
    영업담당자명: "김대리",
    영업담당자연락처: "010-0000-0003",
    영업담당자이메일: "bob@example.com",
    회원사수: 100,
    등록일: new Date("2023-03-20")
  },
  {
    NO: "4",
    아이디: "bob@example.com",
    영업담당자명: "이은지",
    영업담당자연락처: "010-0000-0003",
    영업담당자이메일: "bob@example.com",
    회원사수: 200,
    등록일: new Date("2023-03-20")
  },
  {
    NO: "5",
    아이디: "bob@example.com",
    영업담당자명: "최승희",
    영업담당자연락처: "010-0000-0003",
    영업담당자이메일: "bob@example.com",
    회원사수: 250,
    등록일: new Date("2023-03-20")
  },
];

export default function UsersPage({}: Props) {
  return (
    <div className="flex flex-col gap-5  w-full">
      <PageTitle title="담당자" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
