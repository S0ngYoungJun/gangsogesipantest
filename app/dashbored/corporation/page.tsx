/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */
"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { connectMongoDB } from '@/lib/mongodb'; 
import Member from '@/models/member'

export default function ClientMeberPage() {
  const router = useRouter();
  type Props = {};
  type ClientMember = {
    _id: string; // MongoDB의 고유 ID 사용
    NO?: number;
    companyName: string;
    representativeName: string;
    repContact: string;
    repEmail: Date;
  };
  
const columns: ColumnDef<ClientMember>[] = [
  {
    accessorKey: "NO",
    header: "no.",
  },
  {
    accessorKey: "companyName",
    header: "회사명",
  },
  {
    accessorKey: "representativeName",
    header: "담당자명",
  },
  {
    accessorKey: "repContact",
    header: "담당자연락처",
  },
  {
    accessorKey: "repEmail",
    header: "담당자이메일",
  },
  {
    accessorKey: "등록일",
    header: "등록일",
    cell: ({ row }) => {
      // 등록일 데이터를 Date 객체로 변환
      const dateString = row.getValue("등록일");
      const date = new Date(dateString);
    
      // Date 객체의 유효성을 검사하고, 유효하면 toLocaleDateString을 사용, 아니면 "Invalid date" 반환
      return <span>{isNaN(date.getTime()) ? "Invalid date" : date.toLocaleDateString()}</span>;
    }
  },
  {
    id: 'delete',
    header: '삭제',
    cell: ({ row }) => {
      return <button onClick={() => handleDelete(row)}>삭제</button>;
    }
  },
  {
    accessorKey: "detail",
    header: "상세보기",
    cell: ({ row }) => (
      <button onClick={() => router.push(`/dashbored/corporation/detail?id=${row.original._id}`)}>
        상세
      </button>
    )
  },
];
type DataType = any[]; // 더 구체적인 타입으로 교체할 수 있습니다.

const [data, setData] = useState<ClientMember[]>([]); 

useEffect(() => {
  async function fetchData() {
    const res = await fetch('/api/registerCorporation');
    const fetchedData: ClientMember[] = await res.json();
      
      // Add sequential numbers to each data item
      const numberedData = fetchedData.map((item, index) => ({
        ...item,
        NO: index + 1  // Adding a sequence number starting from 1
      }));
      console.log(numberedData)
      setData(numberedData);
  }
  fetchData();
}, []);

  // const handleDelete = async (row: any) => {
  //   try {
  //     const id = row.getValue("_id");
  //     await Member.findByIdAndDelete(id);
  //     setData(data.filter(item => item._id !== id));
  //   } catch (error) {
  //     console.error('Error deleting data: ', error);
  //   }
  // };

  return (
    <div className="flex flex-col w-full gap-5">
      <PageTitle title="회사" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
