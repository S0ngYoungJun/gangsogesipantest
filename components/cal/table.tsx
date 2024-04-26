import React from 'react';
import styles from './table.module.scss'
type TableProps = {
  data: string[][];
};

const Table: React.FC<TableProps> = ({ data }) => {
  return (
    <table className={styles.table}> {/* border 추가로 테이블 경계를 명확하게 표시 */}
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => {
              // 3행의 2열부터 5열까지 합치기
              if (rowIndex === 2 && cellIndex === 1) {
                return <td key={cellIndex} colSpan={4}>{cell}</td>;
              } else if (rowIndex === 2 && (cellIndex > 1 && cellIndex < 5)) {
                // 3행의 2열부터 5열 사이의 셀은 렌더링하지 않음
                return null;
              }
              return <td key={cellIndex}>{cell}</td>;
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;