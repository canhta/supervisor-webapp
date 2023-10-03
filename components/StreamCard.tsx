import { StreamStatusEnum } from '@/utils/enums';
import { IStream } from '@/utils/interfaces/stream';
import classNames from 'classnames';
import Link from 'next/link';
import React from 'react';

interface Props {
  data: IStream;
}

const StreamCard = ({ data }: Props) => {
  const href = ``;

  return (
    <div
      className={classNames(
        'card w-96 bg-base-100 shadow-xl image-full aspect-video select-none',
        {
          'cursor-pointer': data.status === StreamStatusEnum.Live,
        },
      )}
    >
      <figure>
        <img
          src="/images/stock/photo-1606107557195-0e29a4b5b4aa.jpg"
          alt="Snapshot"
        />
      </figure>
      <div className="card-body">
        <div className="card-actions justify-end">
          <div className="badge badge-accent">{data.status}</div>
        </div>
        <h2 className="card-title">{data.name}</h2>
        <p>{data.address}</p>
      </div>
    </div>
  );
};

export default StreamCard;
