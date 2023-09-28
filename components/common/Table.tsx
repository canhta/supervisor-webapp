import { IObject } from '@/utils/interfaces/system';
import React from 'react';

export interface ITableAction {
  label: string;
  onClick: (id: string) => void;
}

interface Props {
  data: IObject[];
  keys: string[];
  actions?: ITableAction[];
}

const Table = ({ data, keys, actions }: Props) => {
  return (
    <div className="overflow-x-auto">
      <table className="table table-zebra">
        <thead>
          <tr>
            {keys.map((key: string) => (
              <th key={key}>{key}</th>
            ))}
            {actions?.length && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data?.map((item: IObject) => (
            <tr key={item.id}>
              {keys.map((key: string) => (
                <td key={key}>{item[key]}</td>
              ))}

              {actions?.length && (
                <td className="flex gap-2">
                  {actions.map((action) => (
                    <button
                      key={action.label}
                      type="button"
                      className="btn btn-sm btn-outline"
                      onClick={() => action.onClick(item.id)}
                    >
                      {action.label}
                    </button>
                  ))}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
