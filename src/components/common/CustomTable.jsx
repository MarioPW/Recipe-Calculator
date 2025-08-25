import React from 'react';

export const CustomTable = ({ tableData /* Type Objects List */ }) => { 
  if (!tableData || tableData.length === 0) {
    return <p className="text-center my-4">No data available</p>;
  }

  const headers = Object.keys(tableData[0]);

  return (
        <table className="table table-light table-striped text-nowrap mb-0">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="table-group-divider">
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {headers.map((header, cellIndex) => (
                  <td key={cellIndex}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
  );
};