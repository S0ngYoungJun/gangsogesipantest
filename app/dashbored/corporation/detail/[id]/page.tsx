// pages/detail/[id].js
"use client"
import { useEffect,useState, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import styles from '@/styles/detail.module.scss';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';
export default function DetailPage({ params }: { params: { id: string } })  {
  const searchParams = useSearchParams()
 const router = useRouter()
  const search = searchParams.get('id')
  useEffect(()=>{
    console.log(search) 
  })


  
  const [inputs, setInputs] = useState(() => {
    // 로컬 스토리지에서 ID 기반으로 저장된 입력값을 로드합니다.
    const saved = localStorage.getItem(`detailPageInputs-${search}`);
    return saved ? JSON.parse(saved) : {};
  });

  // 입력 값이 변경될 때마다 ID를 기반으로 로컬 스토리지를 업데이트합니다.
  useEffect(() => {
    if (search) {
      localStorage.setItem(`detailPageInputs-${search}`, JSON.stringify(inputs));
    }
  }, [inputs, search]);

  // 컴포넌트 마운트 후 콘솔에 현재 상태를 출력합니다.
  useEffect(() => {
    console.log("Loaded inputs for ID:", search, inputs);
  }, [search, inputs]);

  // 입력 처리 로직
  const handleInputChange = (tableKey : any, rowIndex : any , colIndex : any , value : any) => {
    const key = `${tableKey}-${rowIndex}-${colIndex}`;
    setInputs((prevState : any) => ({
      ...prevState,
      [key]: value,
    }));
  };
 


  const secondTableData = [
    ["대표자", "", "담당자", "d", "부 서", "d"],
    ["사업자등록번호", "d", "담당자 이메일", "d", "직 책", ""],
    ["회사 연락처", "", "담당자 연락처","d" , "팩스 번호", "d"]
  ];


  const pdfRef = useRef(null);  // 프린트할 컴포넌트를 참조할 ref

  // React to Print 설정
  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
  });

  return (
    <main className={styles.root}>
    <div className={styles.main} ref={pdfRef} id="content-to-print">
  
              {/* 추가된 두 번째 테이블 렌더링 */}
              <table className={styles.table2}>
                <tbody className={styles.tbody2}>
                {secondTableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => {
                        // "Data 3-2" 셀일 때 입력란 추가
                        if (rowIndex === 0 && colIndex === 1 ||rowIndex === 2 && colIndex === 1 ||rowIndex === 1 && colIndex === 5) {
                          return (
                            <td key={colIndex}>
                             <input
                                type="text"
                                value={inputs[`secondTable-${rowIndex}-${colIndex}`] || ''}
                                onChange={(e) => handleInputChange('secondTable', rowIndex, colIndex, e.target.value)}
                                placeholder="Type here"
                                className={styles.input}
                              />
                            </td>
                          );
                        }
                        // 나머지 셀은 그냥 텍스트로 렌더링
                        return <td key={colIndex}>{cell}</td>;
                      })}
                    </tr>
                  ))}
                </tbody>
                
                  </table>
                  </div>
                  <button onClick={handlePrint}>프린트 테스트</button>
      </main>
  );
};
