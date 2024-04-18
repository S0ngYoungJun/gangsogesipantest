/**
 * eslint-disable @next/next/no-img-element
 *
 * @format
 */

/** @format */
"use client";

import { DataTable } from "@/components/DataTable";
import { ColumnDef } from "@tanstack/react-table";
import PageTitle from "@/components/PageTitle";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function UsersPage() {
  type Props = {};
  type Admin = {
    NO:string;
    관리자아이디: string;
    관리자명: string;
    관리서비스: string;
    등록일:Date;
  };
const columns: ColumnDef<Admin>[] = [
  {
    accessorKey: "NO",
    header: "no.",
  },
  {
    accessorKey: "관리자아이디",
    header: "관리자아이디.",
  },
  {
    accessorKey: "관리자명",
    header: "관리자 명",
  },
  {
    accessorKey: "관리서비스",
    header: "관리서비스",
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
];
type DataType = any[]; // 더 구체적인 타입으로 교체할 수 있습니다.

const [data, setData] = useState<DataType>([]);

useEffect(() => {
  const fetchData = async () => {
    const { data, error } = await supabase
      .from('admin') // 'admin'이 실제 테이블 이름인지 확인하세요.
      .select('*');

    if (error) {
      console.error('Error fetching data: ', error);
    } else {
      setData(data);
      console.log(data); // 여기로 로그를 옮깁니다.
    }
  };

  fetchData();
}, []);

//삭제버튼
const handleDelete = async (row : any) => {
  const NO = row.getValue("NO");

  const { error } = await supabase
    .from('admin')
    .delete()
    .match({ NO: NO });

  if (error) {
    console.error('Error deleting data: ', error);
  } else {
    // 로컬 state 업데이트로 UI를 즉시 반영
    setData(data.filter(item => item.NO !== NO));
  }
};

  return (
    <div className="flex flex-col w-full gap-5">
      <PageTitle title="담당자" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
