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

  const [companyName, setCompanyName] = useState('');
  const [location, setLocation ] = useState('');

  const [buNumber, setBuNumber]  = useState('');
  const [contact, setContact]  = useState('');
  const [fax, setFax]  = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [department, setDepartment]= useState('');
  const [repContact, setRepContact]= useState('');
  const [repEmail , setRepEmail]= useState('');

  
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
  // useEffect(() => {
  //   async function fetchData() {
  //     const res = await fetch(`/api/corporation/${id}`); // API 엔드포인트 조정 필요
  //     const data = await res.json();
  //     // 상태 설정 또는 데이터 처리
  //   }
  //   if (id) fetchData();
  // }, [id]);


  useEffect(() => {
    async function fetchData() {
      
      try {
        const response = await fetch(`/api/dashbored/corporation/${search}`);
        const data = await response.json();
        setCompanyName(data.companyName);
        setLocation(data.location)
        setBuNumber(data.businessNumber)
        setContact(data.contact)
        setFax(data.fax)
        setRepresentativeName(data.representativeName)
        setDepartment(data.department)
        setRepContact(data.repContact)
        setRepEmail(data.repEmail)

        console.log(data)
      } catch (error) {
        console.error('Failed to fetch company details', error);
      }
    }

    if (search) fetchData();
  }, [search]);

  

  const tableData = [
    ["업체명", "Row 1, Cell 2", "국 문", companyName || "Loading...", "인증범위 내 인원수"],
    ["Row 2, Cell 1", "Row 2, Cell 2", "영 문", "", "Row 2, Cell 5"],
    ["주소", "인증 받는 사업장", "국 문", location, ""],
    ["Row 4, Cell 1", "Row 4, Cell 2", "영 문", "", "Rㅇㅇw 4, Cell 5"],
    ["Row 5, Cell 1", "복 수 사업장", "국 문", "", ""],
    ["Row 6, Cell 1", "Row 6, Cell 2", "영 문", "", "Row 6, Cell 5"]
  ];

  const secondTableData = [
    ["대표자", "", "담당자", representativeName, "부 서", department],
    ["사업자등록번호", buNumber, "담당자 이메일", repEmail, "직 책", ""],
    ["회사 연락처", "", "담당자 연락처", repContact , "팩스 번호", fax]
  ];

  const thirdTableData = [
    ["인증 규격", "", "", ""],
    ["심사 유형", "", "등록 번호", ""],
    ["제 2 외국어", "", "", ""]
  ];
  
  const fourthTableData =[
    ["심사구분", "", ""],
    ["", "", ""],
  ]

  const fifthTableData =[
    ["인증범위", "국 문", ""],
    ["", "영 문", ""],
  ]

  const sixthTableData = [
    ["IAF Code", ""],
    ["EMS 위험등급", ""],
    ["OH&S 위험등급", ""]
  ]

  const seventhTableData =[
    ["인증범위에 해당하는 제품 또는 서비스", "", "설명"],
    ["1", "", ""],
    ["2", "", ""],
    ["3", "", ""],
    ["공급받는 원자재 또는 서비스", "", ""],
    ["외주 처리된 공정", "", ""],
    ["특 수 공 정", "", ""],
  ]
  const pdfRef = useRef(null);  // 프린트할 컴포넌트를 참조할 ref

  // React to Print 설정
  const handlePrint = useReactToPrint({
    content: () => pdfRef.current,
  });

  return (
    <main className={styles.root}>
    <div className={styles.main} ref={pdfRef} id="content-to-print">
        <h1 className={styles.title}>
        UGC 인증신청서
        </h1>
        <table className={styles.table}>
          <tbody className={styles.tbody}>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => {
                  // 첫 번째 행의 첫 번째 두 열을 합친 큰 셀
                  if (rowIndex === 0 && colIndex === 0) {
                    return <td key={colIndex} rowSpan={2} colSpan={2}>{cell}</td>;
                  }
                  // 첫 번째 행의 두 번째 셀과 두 번째 행의 첫 번째 두 셀 렌더링하지 않음
                  if (rowIndex < 2 && colIndex < 2) {
                    return null;
                  }
                  // 행 3부터 행 6까지의 첫 번째 셀을 합친 큰 셀
                  if (colIndex === 0 && rowIndex >= 2 && rowIndex < 6) {
                    if (rowIndex === 2) {
                      return <td key={colIndex} rowSpan={4}>{cell}</td>;
                    }
                    return null; // 합쳐진 셀의 다른 행은 렌더링하지 않음
                  }
                  // 행 3과 행 4의 두 번째 셀을 합침
                  if (colIndex === 1 && (rowIndex === 3 || rowIndex === 2)) {
                    if (rowIndex === 2) {
                      return <td key={colIndex} rowSpan={2}>{cell}</td>;
                    }
                    return null; // 합쳐진 셀의 다른 행은 렌더링하지 않음
                  }
                  // 행 5와 행 6의 두 번째 셀을 합침
                  if (colIndex === 1 && (rowIndex === 5 || rowIndex === 4)) {
                    if (rowIndex === 4) {
                      return <td key={colIndex} rowSpan={2}>{cell}</td>;
                    }
                    return null; // 합쳐진 셀의 다른 행은 렌더링하지 않음
                  }
                  // 각각의 마지막 셀들을 합침
                  if (colIndex === 4 && (rowIndex === 0 || rowIndex === 1 || rowIndex === 2 || rowIndex === 3 || rowIndex === 4 || rowIndex === 5)) {
                    if (rowIndex === 0 ) {
                      return <td key={colIndex} rowSpan={2}>{cell}</td>;
                    }
                    if(rowIndex === 2 || rowIndex === 4){
                      return <td key={colIndex} rowSpan={2} className={styles.white}>
                      <input
                          type="text"
                          value={inputs[`Table-${rowIndex}-${colIndex}`] || ''}
                          onChange={(e) => handleInputChange('Table', rowIndex, colIndex, e.target.value)}
                          placeholder="Type here"
                          className={styles.input}
                        />
                    </td>;
                    }
                    return null; // 합쳐진 셀의 다른 행은 렌더링하지 않음
                  }
                  if ((rowIndex === 1 && colIndex === 3) || (rowIndex === 3 && colIndex === 3)|| (rowIndex === 4 && colIndex === 3)||(rowIndex === 5 && colIndex === 3)||(rowIndex === 2 && colIndex === 4)||(rowIndex === 4 && colIndex === 4)) {
                    return (
                      <td className={styles.white} key={`${rowIndex}-${colIndex}`}>
                        <input
                          type="text"
                          value={inputs[`Table-${rowIndex}-${colIndex}`] || ''}
                          onChange={(e) => handleInputChange('Table', rowIndex, colIndex, e.target.value)}
                          placeholder="Type here"
                          className={styles.input}
                        />
                      </td>
                    );
                  }
                  if ((rowIndex === 0 && colIndex === 3) || (rowIndex === 2 && colIndex === 3)){
                    return (
                    <td className={styles.white} key={colIndex}>
                      {cell}
                    </td>
                    );
                  }
                  // 나머지 셀 정상 렌더링
                  return <td key={colIndex}>{cell}</td>;
                })}
              </tr>
            ))}
          </tbody>
          </table>

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

                  <table className={styles.table3}>
                    <tbody className={styles.tbody3}>
                      {thirdTableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                          {row.map((cell, colIndex) => {
                            // 첫 번째 행과 세 번째 행에서 특정 셀을 합치기
                            if ((rowIndex === 0 || rowIndex === 2) && colIndex === 1) {
                              return <td key={colIndex} colSpan={3} className={styles.white}>
                                <input
                                type="text"
                                value={inputs[`thirdTable-${rowIndex}-${colIndex}`] || ''}
                                onChange={(e) => handleInputChange('thirdTable', rowIndex, colIndex, e.target.value)}
                                placeholder="Type here"
                                className={styles.input}
                              />
                              </td>;
                            }
                            // 합쳐진 셀에 포함되는 다른 셀은 렌더링하지 않습니다.
                            if ((rowIndex === 0 || rowIndex === 2) && (colIndex === 2 || colIndex === 3)) {
                              return null;
                            }
                            if(rowIndex === 1 && (colIndex === 1 || colIndex ===3)){
                              return <td key={colIndex} className={styles.white}>
                                <input
                                type="text"
                                value={inputs[`thirdTable-${rowIndex}-${colIndex}`] || ''}
                                onChange={(e) => handleInputChange('thirdTable', rowIndex, colIndex, e.target.value)}
                                placeholder="Type here"
                                className={styles.input}
                              />
                              </td>;
                            }
                            // 나머지 셀 정상 렌더링
                            return <td key={colIndex}>{cell}</td>;
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <table className={styles.table4}>
                      <tbody className={styles.tbody4}>
                        {fourthTableData.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, colIndex) => {
                              // 첫 번째 행의 모든 셀을 합치기
                              if (rowIndex === 0) {
                                if (colIndex === 0) {
                                  return <td key={colIndex} colSpan={row.length}>{row.join(' ')}</td>;
                                }
                                // 합쳐진 셀에 포함되는 나머지 셀은 렌더링하지 않습니다
                                return null;
                              }
                              if(rowIndex === 1 && ( colIndex===0 || colIndex===1 ||colIndex === 2)){
                                return <td key={colIndex} className={styles.white}>
                                  <input
                                  type="text"
                                  value={inputs[`fourthTable-${rowIndex}-${colIndex}`] || ''}
                                  onChange={(e) => handleInputChange('fourthTable', rowIndex, colIndex, e.target.value)}
                                  placeholder="Type here"
                                  className={styles.input}
                                />
                                </td>;
                              }
                              // 나머지 행 정상 렌더링
                              return <td key={colIndex}>{cell}</td>;
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>

                      <table className={styles.table5}>
                        <tbody className={styles.tbody5}>
                          {fifthTableData.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                              {row.map((cell, colIndex) => {
                                // 첫 번째 열의 첫 번째 행 셀을 합칩니다.
                                if (colIndex === 0 && rowIndex === 0) {
                                  return <td key={colIndex} rowSpan={2}>{cell}</td>;
                                }
                                // 합쳐진 셀 아래의 행은 렌더링하지 않습니다.
                                if (colIndex === 0 && rowIndex === 1) {
                                  return null;
                                }
                                if((rowIndex === 0 || rowIndex === 1) && colIndex === 2){
                                  return <td key={colIndex} className={styles.white}>
                                    <input
                                    type="text"
                                    value={inputs[`fifthTable-${rowIndex}-${colIndex}`] || ''}
                                    onChange={(e) => handleInputChange('fifthTable', rowIndex, colIndex, e.target.value)}
                                    placeholder="Type here"
                                    className={styles.input}
                                  />
                                  </td>;
                                }
                                // 나머지 셀 정상 렌더링
                                
                                return <td key={colIndex}>{cell}</td>;
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>

          <table className={styles.table6}>
                <tbody className={styles.tbody6}>
                  {sixthTableData.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {row.map((cell, colIndex) => {
                        if((rowIndex === 0 || rowIndex === 1 || rowIndex === 2) && colIndex === 1){
                          return <td key={colIndex} className={styles.white}>
                            <input
                            type="text"
                            value={inputs[`sixthTable-${rowIndex}-${colIndex}`] || ''}
                            onChange={(e) => handleInputChange('sixthTable', rowIndex, colIndex, e.target.value)}
                            placeholder="Type here"
                            className={styles.input}
                          />
                          </td>;
                        }
                       return <td key={colIndex}>{cell}</td>
                    })}
                    </tr>
                  ))}
            </tbody>
          </table>

          <table className={styles.table7}>
            <tbody className={styles.tbody7}>
              {seventhTableData.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {row.map((cell, colIndex) => {
                    // 1, 5, 6, 7번 행의 첫 두 열을 합칩니다.
                    if ((rowIndex === 0 || rowIndex === 4 || rowIndex === 5 || rowIndex === 6) && colIndex === 0) {
                      return <td key={colIndex} colSpan={2}>{cell} {row[colIndex+1]}</td>;
                    }
                    // 합쳐진 셀에 포함되는 두 번째 열은 렌더링하지 않습니다.
                    if ((rowIndex === 0 || rowIndex === 4 || rowIndex === 5 || rowIndex === 6) && colIndex === 1) {
                      return null;
                    }
                    
                    if((rowIndex === 1 || rowIndex === 2 || rowIndex === 3) && colIndex === 1){
                      return <td key={colIndex} className={styles.white}>
                        <input
                        type="text"
                        value={inputs[`seventhTable-${rowIndex}-${colIndex}`] || ''}
                        onChange={(e) => handleInputChange('seventhTable', rowIndex, colIndex, e.target.value)}
                        placeholder="Type here"
                        className={styles.input}
                      />
                      </td>;
                    }
                    if((rowIndex === 1 || rowIndex === 2 || rowIndex === 3 || rowIndex === 4 || rowIndex === 5 || rowIndex === 6) && colIndex === 2){
                      return <td key={colIndex} className={styles.white}>
                        <input
                        type="text"
                        value={inputs[`seventhTable-${rowIndex}-${colIndex}`] || ''}
                        onChange={(e) => handleInputChange('seventhTable', rowIndex, colIndex, e.target.value)}
                        placeholder="Type here"
                        className={styles.input}
                      />
                      </td>;
                    }
                    return <td key={colIndex}>{cell}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
      </div>
      <button onClick={handlePrint}>프린트 테스트</button>
      <button onClick={() => router.push(`/dashbored/corporation/detail/${search}`)}>
         이동하기
      </button>
      </main>
  );
};
