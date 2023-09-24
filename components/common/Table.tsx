import { IObject } from '@/interfaces';
import React from 'react';

const Table = (props: { data: IObject[]; keys: string[] }) => {
  return (
    <div className="overflow-x-auto">
      <table className="table">
        <thead>
          <tr>
            {props.keys.map((key: string) => (
              <th key={key}>{key}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.data.map((item: IObject) => (
            <tr key={item.id} className="bg-base-200">
              {props.keys.map((key: string) => (
                <td key={key}>{item[key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
