"use client"

// pages/table.js
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';
import styles from './cal.module.css';
import { useReactToPrint } from 'react-to-print';
import { jsPDF } from "jspdf";
import html2canvas from 'html2canvas';


export default function TablePage() {
  const dropdownOptions = ["ISO 9001:2015", "ISO 14001:2015", "ISO 45001:2018", "ISO 9001:2015 & 14001:2015", "ISO 9001:2015 & 45001:2018", "ISO 14001:2015 & 45001:2018", "ISO 9001:2015 & 14001:2015 & 45001:2018"];
  const newDropdownOptions = ["-", "최초", "사후 1차", "사후 2차", "갱신"];
  const thirdRowOptions = ["대전/충청", "서울/경기/인천", "경상/전라/부산/강원", "제주"];  // 3행 드롭다운 옵션
  const [selectedStandard, setSelectedStandard] = useState(dropdownOptions[0]);
  const initialData = [
    ["심사구분", "산출기준", "", "심사비", "", "총 금액"], // 1행: 2-3열, 4-5열 합침
    ["신청비", "합친 항목 B-E", "", "", "", "항목 F"], // 2행: 2-5열 합침
    ["1단계 순서 심사 진행", "분할 항목 2-1", "분할 항목 2-2", "합친 항목 4-5", "", "0"], // 3행: 4-5열 합침
    ["1단계 순서 심사 진행", "분할 항목 2-1", "분할 항목 2-2", "합친 항목 4-5", "", "0"], // 4행: 동일한 3행 설정
    ["1단계 심사 총 출장비", "선임 심사원", "aaa", "심사원", "분할 항목5", "0"], // 5행: 동일한 3,4행 설정
    ["2단계 현장 심사 진행", "분할 항목 2-1", "분할 항목 2-2", "합친 항목 4-5", "", "0"], // 6행: 동일한 3,4,5행 설정
    ["2단계 현장 심사 진행", "분할 항목 2-1", "분할 항목 2-2", "합친 항목 4-5", "", "0"], // 7행: 동일한 3,4,5,6행 설정
    ["2단계 심사 총 출장비", "선임 심사원", "단일 항목 2-2", "심사원", "", "0"], // 8행: 동일한 3,4,5,6,7행 설정
    ["합 계", "합친 항목 2-3", "", "합친 항목 4-5", "", ""]  // 9행: 1행 설정과 동일
];
const [thridTableData, setThirdTableData] = useState([
  ['부가세 10%', '신청비', '심사비', '출장비', ''],
  ['할인', '한국ISO지원센터 특별 할인', '', '', ''],
  ['총합계금액', '', '', '', '']
]);
  const [selectedType, setSelectedType] = useState(newDropdownOptions[1]);
    // 1열의 내용을 미리 설정
    const rowData = [
        '업 체 명',
        '인 원',
        '인증 사업장',
        '인증 표준',
        '인증 구분',
        '인증 범위'
    ];
    const [selectedRegion, setSelectedRegion] = useState(thirdRowOptions[0]); // 선택된 지역 상태
    const [regionPrices, setRegionPrices] = useState<{ [key: string]: number }>({ // 인덱스 서명 추가
      "대전/충청": 100000,
      "서울/경기/인천": 140000,
      "경상/전라/부산/강원": 200000,
      "제주": 300000
    });
    
    const pdfRef = useRef(null);
 //<HTMLDivElement>
      const [additionalFactors, setAdditionalFactors] = useState({
        row3: 0, // 초기값 설정
        row4:0,
        row6: 0,
        row7:0
    });
  
  
    // 선임 심사원 
    const [seniorAuditorsRow3, setSeniorAuditorsRow3] = useState(0);
    const [seniorAuditorsRow6, setSeniorAuditorsRow6] = useState(0);
    //심사원
    const [auditorsRow4, setAuditorsRow4] = useState(0);
    const [auditorsRow7, setAuditorsRow7] = useState(0);
    const [incrementPerAuditor300, setIncrementPerAuditor300] = useState(300000);
    const [incrementPerAuditor200, setIncrementPerAuditor200] = useState(200000);
  
    const handleIncrementChange300 = (event : any) => {
      setIncrementPerAuditor300(event.target.value);
    };
  
    const handleIncrementChange200 = (event : any) => {
      setIncrementPerAuditor200(event.target.value);
    };

    
    const priceMapping = {
      "ISO 9001:2015": { "최초": 300000, "사후": 200000, "갱신": 250000 },
      "ISO 14001:2015": { "최초": 300000, "사후": 200000, "갱신": 250000 },
      "ISO 45001:2018": { "최초": 300000, "사후": 200000, "갱신": 250000 },
      "ISO 9001:2015 & 14001:2015": { "최초": 500000, "사후": 350000, "갱신": 400000 },
      "ISO 9001:2015 & 45001:2018": { "최초": 500000, "사후": 350000, "갱신": 400000 },
      "ISO 14001:2015 & 45001:2018": { "최초": 500000, "사후": 350000, "갱신": 400000 },
      "ISO 9001:2015 & 14001:2015 & 45001:2018": { "최초": 700000, "사후": 500000, "갱신": 550000 }
  };

  const [discount, setDiscount] = useState(0);

  const handleDiscountChange = (e) => {
    const value = e.target.value;
    // 입력값이 비었거나 0으로 시작할 경우 초기화
    if (value === '' || value === '0') {
      e.target.value = value.replace(/^0+/, '');
    }
    setDiscount(parseInt(value, 10) || "");
  };

const [secondTableData, setSecondTableData] = useState(initialData);

const calculatePrice = (standard, type) => {
  // "사후 1차"와 "사후 2차"는 같은 가격 적용
  if (type === "사후 1차" || type === "사후 2차") type = "사후";
  return priceMapping[standard]?.[type] || 0;
};

// 드롭다운 상태 변경시 가격 업데이트
useEffect(() => {
  const newPrice = calculatePrice(selectedStandard, selectedType);
  setSecondTableData(currentData => {
      const newData = [...currentData];
      newData[1] = ["신청비", newPrice.toLocaleString(), "", "", "", newData[1][5]]; // 새 가격으로 2행 2열 업데이트
      return newData;
  });
}, [selectedStandard, selectedType]);

    const [inputs, setInputs] = useState([
      '', '', '',
      'ISO 9001:2015', // 기본값으로 'Option 1' 설정
      ['','ISO 9001:2015'], // 5번째 행의 초기값으로 'Option 1' 설정
      ''
  ]);

  
  const handleStandardChange = (e : any) => {
    setSelectedStandard(e.target.value);
};

const handleTypeChange = (e : any) => {
    setSelectedType(e.target.value);
};

const handleRegionChange = (e : any) => {
  setSelectedRegion(e.target.value);
  console.log("Region selected:", e.target.value);  // 현재 선택된 지역을 콘솔에 출력
};

const handleInputChange = (index : any, value : any) => {
  const newInputs = [...inputs];
  newInputs[index] = value;

  // 인증 표준 드롭다운의 값이 변경되었을 때
  if (index === 3) {
      setSelectedStandard(value); // 상태 업데이트
      newInputs[4] = [newInputs[4][0], value]; // 연관된 셀 값 업데이트
  }

  // 인증 구분 드롭다운의 값이 변경되었을 때
  if (index === 4) {
      setSelectedType(value[0]); // 상태 업데이트
  }

  setInputs(newInputs);
};

useEffect(() => {
  const newPrice = calculatePrice(selectedStandard, selectedType);
  const formattedPrice = newPrice.toLocaleString();
  setSecondTableData(currentData => {
    const newData = currentData.map((row, index) => {
        if (index === 0 || index === 8) {
            // 첫 번째와 마지막 행은 제목 행이므로 변경하지 않음
            return row;
        } else if (index === 1) {
            // 두 번째 행은 드롭다운에서 선택된 값을 기준으로 가격을 업데이트하고
            // '합친 항목 B-E'와 '총 금액'을 동일한 값으로 설정
            return ["신청비", formattedPrice, "", "", "", formattedPrice];
        } else {
            // 나머지 행들은 별도의 계산 로직을 통해 업데이트할 수 있음
            // 예시로, 현재는 그대로 둡니다.
            return row;
        }
    });

    return newData;
    });
}, [selectedStandard, selectedType]);

useEffect(() => {
  setSecondTableData(prevData => {
    return prevData.map((row, rowIndex) => {
      if (rowIndex === 2 || rowIndex === 5) {
        const rowKey = rowIndex === 2 ? 'row3' : 'row6';
        const auditors = rowIndex === 2 ? seniorAuditorsRow3 : seniorAuditorsRow6;
        const additionalFactor = rowIndex === 2 ? additionalFactors.row3 : additionalFactors.row6;
        const totalAmount = auditors * incrementPerAuditor300 * additionalFactor;

        const newRow = [...row];
        newRow[2] = `${auditors}명 x ${incrementPerAuditor300.toLocaleString()} = ${totalAmount.toLocaleString()}`;
        return newRow;
      }
      return row;
    });
  });
}, [seniorAuditorsRow3, seniorAuditorsRow6, additionalFactors.row3, additionalFactors.row6, incrementPerAuditor300]); 

const handleCellInputChange = (rowIndex: number, cellIndex: number, value: string) => {
  setSecondTableData(prevData => {
      return prevData.map((row, rIndex) => {
          if (rIndex === rowIndex) {
              const newRow = [...row];
              newRow[cellIndex] = value;
              return newRow;
          }
          return row;
      });
  });
};

const handleSeniorAuditorChange = (rowIndex : any, value : any)  => {
  const newValue = parseInt(value, 10) || 0;
  if (rowIndex === 2) {
    setSeniorAuditorsRow3(newValue);
  } else if (rowIndex === 5) {
    setSeniorAuditorsRow6(newValue);
  }
};


const handleAdditionalFactorChange = (rowKey : any , value : any) => {
  const newValue = parseFloat(value);
  if (rowKey === 'row3') {
    setAdditionalFactors(prev => ({ ...prev, row3: newValue }));
  } else if (rowKey === 'row4') {
    setAdditionalFactors(prev => ({ ...prev, row4: newValue }));
  } else if (rowKey === 'row6') {
    setAdditionalFactors(prev => ({ ...prev, row6: newValue }));
  } else if (rowKey === 'row7') {
    setAdditionalFactors(prev => ({ ...prev, row7: newValue }));
  }
};




// 핸들러 함수 추가
const handleAuditorChange = (rowIndex : any , value : any) => {
  const newValue = parseInt(value, 10) || 0;  // 입력 값이 없거나 유효하지 않은 경우 0으로 처리
  if (rowIndex === 3) {
    setAuditorsRow4(newValue);
  } else if (rowIndex === 6) {
    setAuditorsRow7(newValue);
  }
};

// useEffect 내에서 심사원 수 변경 감지하여 렌더링 업데이트
useEffect(() => {
  setSecondTableData(prevData => {
    return prevData.map((row, rowIndex) => {
      if (rowIndex === 3 || rowIndex === 6) {
        const rowKey = rowIndex === 3 ? 'row4' : 'row7';
        const auditors = rowIndex === 3 ? auditorsRow4 : auditorsRow7;
        const additionalFactor = rowIndex === 3 ? additionalFactors.row4 : additionalFactors.row7;
        const totalAmount = auditors * incrementPerAuditor200 * additionalFactor;

        const newRow = [...row];
        newRow[3] = `${auditors}명 x ${incrementPerAuditor200.toLocaleString()} = ${totalAmount.toLocaleString()}`;
        return newRow;
      }
      return row;
    });
  });
}, [auditorsRow4, auditorsRow7, additionalFactors.row4 , additionalFactors.row7, incrementPerAuditor200]);

useEffect(() => {
  setSecondTableData(prevData => {
    let combinedAmountRow34 = 0; // 3, 4행의 합산 금액
    let combinedAmountRow67 = 0; // 6, 7행의 합산 금액

    const newData = prevData.map((row, rowIndex) => {
      if (rowIndex === 2 || rowIndex === 3) {
        const incrementPerAuditor = rowIndex === 2 ? incrementPerAuditor300 : incrementPerAuditor200;
        const auditors = rowIndex === 2 ? seniorAuditorsRow3 : auditorsRow4;
        const additionalFactor = rowIndex === 2 ? additionalFactors.row3 : additionalFactors.row4;
        const totalAmount = auditors * incrementPerAuditor * additionalFactor;
        combinedAmountRow34 += totalAmount; // 합산
        return row;
      } else if (rowIndex === 5 || rowIndex === 6) {
        const incrementPerAuditor = rowIndex === 5 ? incrementPerAuditor300 : incrementPerAuditor200;
        const auditors = rowIndex === 5 ? seniorAuditorsRow6 : auditorsRow7;
        const additionalFactor = rowIndex === 5 ? additionalFactors.row6 : additionalFactors.row7;
        const totalAmount = auditors * incrementPerAuditor * additionalFactor;
        combinedAmountRow67 += totalAmount; // 합산
        return row;
      }
      return row;
    });

    // 3행과 6행에 합산된 totalAmount를 설정
    newData[2][5] = combinedAmountRow34.toLocaleString(); // 3행 6열에 합산된 값 저장
    newData[5][5] = combinedAmountRow67.toLocaleString(); // 6행 6열에 합산된 값 저장

    return newData;
  });
}, [seniorAuditorsRow3, auditorsRow4, seniorAuditorsRow6, auditorsRow7, additionalFactors, incrementPerAuditor300, incrementPerAuditor200]);




useEffect(() => {
  setSecondTableData(prevData => {
    const newData = [...prevData];
    // 5행 3열에 값을 업데이트하기 위한 설정
    const pricePerAuditor = regionPrices[selectedRegion];
    const baseTotalAmount = seniorAuditorsRow3 * pricePerAuditor;  // 5행의 선임 심사원 수와 가격을 사용한 기본 계산

    // 3행 3열의 입력값을 사용하여 추가 금액 계산
    const additionalInput = additionalFactors.row3;
    const factor = Math.max(0, Math.ceil(additionalInput) - 1);   // 소수 부분을 무시하고 정수만 취함
    const additionalAmount = seniorAuditorsRow3 *factor * 60000;

    // 최종 금액 계산
    const totalAmount = baseTotalAmount + additionalAmount;
    // const formattedAmount = `${seniorAuditorsRow3}명 x ${pricePerAuditor.toLocaleString()} + 추가 ${additionalAmount.toLocaleString()} = ${totalAmount.toLocaleString()}`;

    // 5행 3열에 계산된 값을 업데이트
    newData[4][2] = totalAmount.toLocaleString()

    return newData;
  });
}, [seniorAuditorsRow3, additionalFactors.row3, selectedRegion, regionPrices]);

useEffect(() => {
  setSecondTableData(prevData => {
    const newData = [...prevData];
    const pricePerAuditor = regionPrices[selectedRegion];
    const baseTotalAmount = auditorsRow4 * pricePerAuditor;

    const additionalInput = additionalFactors.row4;
    const factor = Math.max(0, Math.ceil(additionalInput) - 1);   // 소수 부분을 무시하고 정수만 취함
    const additionalAmount = auditorsRow4 *factor * 60000;

    
    const totalAmount = baseTotalAmount + additionalAmount;
        
    newData[4][4] = totalAmount.toLocaleString()    
    return newData;
  });
}, [auditorsRow4, additionalFactors.row4 ,selectedRegion, regionPrices]); // 의존성 배열에 포함

useEffect(() => {
  setSecondTableData(prevData => {
    const newData = [...prevData];
    const pricePerAuditor = regionPrices[selectedRegion];

    // 8행 3열: 선임 심사원 금액 계산
    const baseTotalAmountSenior = seniorAuditorsRow6 * pricePerAuditor;
    const additionalInputSenior = additionalFactors.row6;
    const factorSenior = Math.max(0, Math.ceil(additionalInputSenior) - 1);
    const additionalAmountSenior = seniorAuditorsRow6 * factorSenior * 60000;
    const totalAmountSenior = baseTotalAmountSenior + additionalAmountSenior;
    newData[7][2] = totalAmountSenior.toLocaleString();  // 업데이트는 8행 3열

    // 8행 4열: 일반 심사원 금액 계산
    const baseTotalAmountAuditor = auditorsRow7 * pricePerAuditor;
    const additionalInputAuditor = additionalFactors.row7;
    const factorAuditor = Math.max(0, Math.ceil(additionalInputAuditor) - 1);
    const additionalAmountAuditor = auditorsRow7 * factorAuditor * 60000;
    const totalAmountAuditor = baseTotalAmountAuditor + additionalAmountAuditor;
    newData[7][4] = totalAmountAuditor.toLocaleString();  // 업데이트는 8행 4열

    return newData;
  });
}, [seniorAuditorsRow6, additionalFactors.row6, auditorsRow7, additionalFactors.row7, selectedRegion, regionPrices]); // 의존성 배열

useEffect(() => {
  setSecondTableData(prevData => {
    const newData = [...prevData];

    // 계산된 값만 업데이트할 때 비교를 위해 현재 값을 파싱
    const currentSumForRow5 = parseInt(newData[4][5].replace(/[^0-9]/g, ''), 10);
    const currentSumForRow8 = parseInt(newData[7][5].replace(/[^0-9]/g, ''), 10);

    // 5행 6열: 5행 3열과 5열의 합
    const newSumForRow5 = parseInt(newData[4][2].replace(/[^0-9]/g, ''), 10) + parseInt(newData[4][4].replace(/[^0-9]/g, ''), 10);

    // 8행 6열: 8행 3열과 5열의 합
    const newSumForRow8 = parseInt(newData[7][2].replace(/[^0-9]/g, ''), 10) + parseInt(newData[7][4].replace(/[^0-9]/g, ''), 10);

    // 값이 변경되었을 때만 업데이트
    if (newSumForRow5 !== currentSumForRow5) {
      newData[4][5] = newSumForRow5.toLocaleString();
    }

    if (newSumForRow8 !== currentSumForRow8) {
      newData[7][5] = newSumForRow8.toLocaleString();
    }

    return newData;
  });
}, [seniorAuditorsRow3,additionalFactors.row3,  additionalFactors.row4, auditorsRow4, seniorAuditorsRow6, additionalFactors.row6, auditorsRow7, additionalFactors.row7, regionPrices, selectedRegion]); 

useEffect(() => {
  setSecondTableData(prevData => {
    const newData = [...prevData];
    
    // 6열의 2행부터 8행까지의 값 합산
    let totalSum = 0;
    for (let i = 1; i <= 7; i++) {
      const cleanNumber = parseInt(newData[i][5].replace(/[^0-9]/g, ''), 10);
      console.log(`Row ${i+1} value: ${newData[i][5]}, parsed: ${cleanNumber}`);  // 값 확인 로그
      totalSum += cleanNumber;
    }

    console.log(`Total sum before setting: ${totalSum}`);  // 합산 전 최종 값 로그
    // 9행의 6열에 합산된 값 설정
    newData[8][5] = totalSum.toLocaleString();
    console.log(`Total sum after setting: ${newData[8][5]}`);  // 설정 후 값 로그

    return newData;
  });
}, [seniorAuditorsRow3, seniorAuditorsRow6, auditorsRow4, auditorsRow7, additionalFactors, regionPrices, selectedRegion]); // 의존성 배열에 관련된 모든 상태 포함

useEffect(() => {
  setSecondTableData(prevData => {
    const newData = [...prevData];
    // 3, 4, 6, 7행의 4열과 5열 값들의 총합 계산
    const sum = [2, 3, 5, 6] // 해당 행 인덱스
      .reduce((acc, rowIndex) => {
        const row = newData[rowIndex];
        // 4열과 5열의 값을 숫자로 변환하여 더하기
        const sumForRow = [5] // 해당 열 인덱스
          .reduce((sum, colIndex) => sum + parseInt(row[colIndex].replace(/[^0-9]/g, ''), 10) || 0, 0);
        return acc + sumForRow;
      }, 0);

    // 7행의 2열 업데이트
    newData[8][1] = sum.toLocaleString(); // 총합을 문자열로 변환하여 저장
    return newData;
  });
}, [secondTableData]); // secondTableData에 의존하여 변화 감지

useEffect(() => {
  setSecondTableData(prevData => {
    const newData = [...prevData];
    // 5행과 8행의 3열, 4열 값들의 총합 계산
    const rowsToSum = [4, 7]; // 5행과 8행의 인덱스
    const columnsToSum = [2, 4]; // 3열과 4열의 인덱스
    const totalSum = rowsToSum.reduce((total, rowIndex) => {
      const rowSum = columnsToSum.reduce((sum, colIndex) => {
        // 숫자만 추출하여 더하기
        return sum + (parseInt(newData[rowIndex][colIndex].replace(/[^0-9]/g, ''), 10) || 0);
      }, 0);
      return total + rowSum;
    }, 0);

    // 9행 4열에 합산 값 저장
    newData[8][3] = totalSum.toLocaleString();
    return newData;
  });
}, [secondTableData]); // secondTableData 변경 시 업데이트


const downloadPdfDocument = () => {
  const input = document.getElementById('content-to-print'); // 특정 요소 선택
  if (!input) return;
  html2canvas(input, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4"
      });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const widthRatio = pageWidth / canvas.width;
      const heightRatio = pageHeight / canvas.height;
      const ratio = widthRatio > heightRatio ? heightRatio : widthRatio;

      const canvasWidth = canvas.width * ratio;
      const canvasHeight = canvas.height * ratio * 2;
      const marginX = (pageWidth - canvasWidth) / 2;
      const marginY = (pageHeight - canvasHeight) / 2;

      pdf.addImage(imgData, 'PNG', marginX, marginY, canvasWidth, canvasHeight);
      pdf.save("download.pdf");
  });
}

//3번째표 

useEffect(() => {
  const newPrice = calculatePrice(selectedStandard, selectedType) / 10;
  setThirdTableData(currentData => {
    const newData = [...currentData];
    newData[0][1] = newPrice.toLocaleString(); // 1행 2열에 새 가격으로 업데이트
    return newData;
  });
}, [selectedStandard, selectedType]);

useEffect(() => {
  const sumRowsIndices = [2, 3, 5, 6]; // 3, 4, 6, 7행 인덱스
  const sumColumnsIndices = [5]; // 4열과 5열 인덱스

  // 2번째 표 데이터로부터 값을 계산
  const totalSum = sumRowsIndices.reduce((total, rowIndex) => {
    const rowSum = sumColumnsIndices.reduce((sum, colIndex) => {
      // 숫자만 추출하여 더하기
      return sum + (parseInt(secondTableData[rowIndex][colIndex].replace(/[^0-9]/g, ''), 10) || 0);
    }, 0);
    return total + rowSum;
  }, 0);

  // 3번째 표의 1행 4열에 계산된 값을 설정
  setThirdTableData(currentData => {
    const newData = [...currentData];
    const lastsum = totalSum / 10;
    newData[0][2] = lastsum.toLocaleString(); // 1행 4열에 값 설정
    return newData;
  });
}, [secondTableData]); // secondTableData가 변경될 때마다 실행



useEffect(() => {
  const rowsToSum = [4, 7]; // 5행과 8행의 인덱스
  const columnsToSum = [2, 4]; // 3열과 4열의 인덱스

  // 2번째 표 데이터로부터 값을 계산
  const totalSum = rowsToSum.reduce((total, rowIndex) => {
    const rowSum = columnsToSum.reduce((sum, colIndex) => {
      // 2번째 표의 숫자만 추출하여 더하기
      return sum + (parseInt(secondTableData[rowIndex][colIndex].replace(/[^0-9]/g, ''), 10) || 0);
    }, 0);
    return total + rowSum;
  }, 0);

  // 3번째 표의 1행 3열에 계산된 값을 설정
  setThirdTableData(currentData => {
    const newData = [...currentData];
    const lastsum = totalSum / 10;
    newData[0][3] = lastsum.toLocaleString(); // 1행 3열에 값 설정
    return newData;
  });
}, [secondTableData]); // secondTableData가 변경될 때마다 실행

useEffect(() => {
  // 1행의 2, 3, 4열 값을 가져와 숫자로 변환 후 합산
  const valuesToSum = [1, 2, 3].map(colIndex => parseInt(thridTableData[0][colIndex].replace(/[^0-9]/g, ''), 10) || 0);
  const totalSum = valuesToSum.reduce((acc, value) => acc + value, 0);

  // 계산된 합을 1행의 5열에 업데이트
  setThirdTableData(currentData => {
    const newData = [...currentData];
    newData[0][4] = totalSum.toLocaleString(); // 5열 (인덱스 4)에 합산된 값 설정
    return newData;
  });
}, [thridTableData[0][1], thridTableData[0][2], thridTableData[0][3]]); // 2, 3, 4열의 값에 의존

  return (
        <div className={styles.container} ref={pdfRef} id="content-to-print" >
            <Head>
                <title>Document Table</title>
            </Head>
            <h1>인증 기업 정보</h1>
            <table className={styles.table}>
                <tbody>
                    {rowData.map((cellContent, index) => (
                        <tr key={index}>
                            <td>{cellContent}</td>
                            {index === 4 ? (
                                // 5번째 행, 두 개의 드롭다운
                                <>
                                    <td>
                                        <select
                                            value={inputs[index] && inputs[index][0] ? inputs[index][0] : ''}
                                            onChange={(e) => handleInputChange(index, [e.target.value, inputs[index][1]])}
                                            className={styles.input}
                                        >
                                            {newDropdownOptions.map((option, optionIndex) => (
                                                <option key={optionIndex} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                    <td>
                                        <input
                                            type="text"
                                            value={inputs[index] && inputs[index][1] ? inputs[index][1] : ''}
                                            className={styles.input}
                                            readOnly
                                        />
                                    </td>
                                </>
                            ) : index === 3 ? (
                                // 4번째 행, 기존 드롭다운
                                <td colSpan={2}>
                                    <select
                                        value={inputs[index]}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className={styles.input}
                                    >
                                        {dropdownOptions.map((option, optionIndex) => (
                                            <option key={optionIndex} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            ) : index === 2 ? (
                                // 3번째 행, 새로운 드롭다운
                                <td colSpan={2}>
                                    <select
                                        value={selectedRegion}
                                        onChange={handleRegionChange}
                                        className={styles.input}
                                    >
                                        {thirdRowOptions.map((option, optionIndex) => (
                                            <option key={optionIndex} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            ) : index === 1 ? (
                                // 2번째 행, 숫자 입력 및 '명'
                                <td colSpan={2} style={{ display: 'flex', alignItems: 'center' }}>
                                    <input
                                        type="number"
                                        min="0"
                                        value={inputs[index]||0}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className={styles.input}
                                    />
                                    <span>명</span>
                                </td>
                            ) : (
                                // 기본 텍스트 입력 필드
                                <td colSpan={2}>
                                    <input
                                        type="text"
                                        
                                        value={inputs[index]}
                                        onChange={(e) => handleInputChange(index, e.target.value)}
                                        className={styles.input}
                                    />
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
            <h1>인증 비용 명세</h1>
            <table className={styles.secondTable}>
            <tbody>
                    {secondTableData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => {
                                 if ((rowIndex === 2 || rowIndex === 5) && cellIndex === 1) {
                                  const handleInputChange = (e : any) => handleSeniorAuditorChange(rowIndex, e.target.value);
                                  return (
                                      <td key={`input-${rowIndex}-${cellIndex}`} className={`${styles.narrowInputstyles} ${styles.inputContainer}`}>
                                          <label className={styles.label}>선임 심사원</label>
                                          <input
                                              type="number"
                                              min="0" // 최소값 설정
                                              value={rowIndex === 2 ? seniorAuditorsRow3 : seniorAuditorsRow6}
                                              onChange={(e) => handleSeniorAuditorChange(rowIndex, e.target.value)}
                                              className={styles.input}
                                          />
                                          <span className={styles.unitLabel}>명</span>
                                      </td>
                                  );
                              } else if ((rowIndex === 3 || rowIndex === 6) && cellIndex === 1) {
                                const handleInputChange = (e : any) => handleAuditorChange(rowIndex, e.target.value);
                                  return (
                                    <td key={`input-${rowIndex}-${cellIndex}`} className={`${styles.narrowInputstyles} ${styles.inputContainer}`}>
                                      <label className={styles.label}>심사원</label>
                                      <input
                                        type="number"
                                        min="0" // 최소값 설정
                                        value={rowIndex === 3 ? auditorsRow4 : auditorsRow7}
                                        onChange={(e) => handleAuditorChange(rowIndex, e.target.value)}
                                        className={styles.input}
                                      />
                                      <span className={styles.unitLabel}>명</span>
                                    </td>
                                  );
                              }
                              if ((rowIndex === 2 || rowIndex === 3 || rowIndex === 5 || rowIndex === 6) && cellIndex === 5) {
                                if (rowIndex === 2 || rowIndex === 5) {
                                  // 3, 6행에서 6열을 렌더링하고 rowSpan을 설정
                                  return <td key={`total-${rowIndex}-${cellIndex}`} rowSpan={2}>{cell}</td>;
                                }
                                return null;  // 4, 7행에서는 6열을 렌더링하지 않음
                              }

                              if ((rowIndex === 2 || rowIndex === 5) && (cellIndex === 2 || cellIndex === 3)) {
                                const rowKey = rowIndex === 2 ? 'row3' : 'row6';
                                const auditors = rowIndex === 2 ? seniorAuditorsRow3 : seniorAuditorsRow6;
                                const additionalFactor = rowIndex === 2 ? additionalFactors.row3 : additionalFactors.row6;
                                const totalAmount = auditors * incrementPerAuditor300 * additionalFactor;  // 최종 계산
                            
                                if (cellIndex === 2) {
                                    // 2열에서는 계산을 위한 입력과 심사원 수를 보여주는 부분
                                    return (
                                        <td key={`input-${rowIndex}-${cellIndex}`}>
                                            <div>{`${auditors}명 x ${incrementPerAuditor300.toLocaleString()}`}</div>
                                            <input
                                                type="number"
                                                min="0.5"
                                                step="0.5"
                                                value={additionalFactor}
                                                onChange={(e) => handleAdditionalFactorChange(rowKey, e.target.value)}
                                                className={styles.input}
                                            /><input
                                            type="number"
                                            value={incrementPerAuditor300}
                                            className={styles.input2}
                                            onChange={handleIncrementChange300}
                                          />
                                        </td>
                                    );
                                } else if (cellIndex === 3) {
                                    // 3열에서는 계산된 totalAmount를 표시하며, 이 열은 원래 4-5열과 합쳐져 있었음
                                    return (
                                        <td key={`total-${rowIndex}-${cellIndex}`} colSpan={2}>
                                            <div>{totalAmount.toLocaleString()}</div>
                                        </td>
                                    );
                                }
                            }
                            else if ((rowIndex === 3 || rowIndex === 6) && (cellIndex === 2 || cellIndex === 3)) {
                              const rowKey = rowIndex === 3 ? 'row4' : 'row7';
                              const auditors = rowIndex === 3 ? auditorsRow4 : auditorsRow7;
                              const additionalFactor = rowIndex === 3 ? additionalFactors.row4 : additionalFactors.row7;
                  
                              const totalAmount = auditors * incrementPerAuditor200 * additionalFactor;  // 최종 계산
                      
                              if (cellIndex === 2) {
                                  return (
                                      <td key={`input-${rowIndex}-${cellIndex}`}>
                                          <div>{`${auditors}명 x ${incrementPerAuditor200.toLocaleString()}`}</div>
                                          <input
                                              type="number"
                                              min="0.5"
                                              step="0.5"
                                              value={additionalFactor}
                                              onChange={(e) => handleAdditionalFactorChange(rowKey, e.target.value)}
                                              className={styles.input}
                                          />
                                           <input
                                              type="number"
                                              className={styles.input2}
                                              value={incrementPerAuditor200}
                                              onChange={handleIncrementChange200}
                                            />
                                      </td>
                                  );
                              } else if (cellIndex === 3) {
                                  return (
                                      <td key={`total-${rowIndex}-${cellIndex}`} colSpan={2}>
                                          <div>{totalAmount.toLocaleString()}</div>
                                      </td>
                                  );
                              }
                          }
                            
                                if (rowIndex === 0 || rowIndex === 8) { // 첫 번째와 마지막(9번째) 행에서 셀 합치기
                                    if (cellIndex === 1 || cellIndex === 3) {
                                        return <td key={cellIndex} colSpan={2}>{cell}</td>; // 2-3, 4-5열 합치기
                                    } else if (cellIndex === 2 || cellIndex === 4) {
                                        return null; // 3열, 5열은 렌더링하지 않음
                                    }
                                }
                                else if (rowIndex === 1 && cellIndex === 1) {
                                    return <td key={cellIndex} colSpan={4}>{cell}</td>; // 두 번째 행에서 2-5열 합치기
                                } else if (rowIndex === 1 && (cellIndex > 1 && cellIndex < 5)) {
                                    return null; // 두 번째 행에서 합쳐진 셀 다음 셀들은 렌더링하지 않음
                                }
                                // 3, 4, 6, 7행에서 셀 조정
                                else if ((rowIndex === 2 || rowIndex === 3 || rowIndex === 5 || rowIndex === 6) && cellIndex === 0) {
                                    if (rowIndex === 2 || rowIndex === 5) {
                                        return <td key={cellIndex} rowSpan={2}>{cell}</td>; // 1열을 3-4, 6-7행에서 합치기
                                    }
                                    return null; // 4, 7행의 1열은 렌더링하지 않음
                                }
                                else if ((rowIndex === 2 || rowIndex === 3 || rowIndex === 5 || rowIndex === 6) && cellIndex === 5) {
                                  if (rowIndex === 2 || rowIndex === 5) {
                                      return <td key={cellIndex} rowSpan={2}>{cell}</td>; // 6열을 3-4, 6-7행에서 합치기
                                  }
                                  return null; // 4, 7행의 6열은 렌더링하지 않음
                              }
                                else if ((rowIndex === 2 || rowIndex === 3 || rowIndex === 5 || rowIndex === 6) && (cellIndex === 1 || cellIndex === 2)) {
                                    return <td key={cellIndex}>{cell}</td>; // 2열을 두 개로 나눔
                                } else if ((rowIndex === 2 || rowIndex === 3 || rowIndex === 5 || rowIndex === 6) && cellIndex === 3) {
                                    return <td key={cellIndex} colSpan={2}>{cell}</td>; // 4열과 5열 합치기
                                } else if ((rowIndex === 2 || rowIndex === 3 || rowIndex === 5 || rowIndex === 6) && cellIndex === 4) {
                                    return null; // 5열은 렌더링하지 않음
                                }
                                return <td key={cellIndex}>{cell}</td>; // 기본 셀 렌더링
                            })}
                        </tr>
                    ))}
                </tbody>
        </table>
        <h1>제3의 표</h1>
      <table className={styles.table3}>
      <tbody>
         {thridTableData.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, colIndex) => {
              // 2행과 3행의 3, 4, 5열을 합치기
              if ((rowIndex === 1 || rowIndex === 2) && (colIndex === 1)) {
                return <td key={colIndex} colSpan={3} className="colspan-cell">{cell}</td>;
              } else if ((rowIndex === 1 || rowIndex === 2) && (colIndex === 2 || colIndex === 3)) {
                return null; // 합친 셀로 인해 렌더링하지 않음
              }
              if (rowIndex === 1 && colIndex === 4) {
                // 2행 5열에 입력 필드 추가
                return (
                  <td key={colIndex}>
                    <input
                      type="number"
                      value={discount}
                      onChange={handleDiscountChange}
                      className={styles.input}
                  
                    
                    />
                  </td>
                );
              }
              return <td key={colIndex}>{cell}</td>; // 기본 셀 렌더링
            })}
          </tr>
        ))}
      </tbody>
      </table>
        <button onClick={downloadPdfDocument}>Download PDF</button>
        </div>
    );
}