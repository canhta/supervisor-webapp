import { StreamStatusEnum } from '@/utils/enums';
import { IStream } from '@/utils/interfaces/stream';
import classNames from 'classnames';
import React, { useMemo } from 'react';

interface Props {
  data: IStream;
}

const StreamCard = ({ data }: Props) => {
  // const onStartClicked = useMemo(async () => {

  //   const res = fetch(`/api/v1/streams/${}`)
  // }, []);
  return (
    <div
      className={classNames(
        'card w-full bg-base-100 shadow-xl image-full aspect-video select-none',
        {
          'cursor-pointer': data.status === StreamStatusEnum.Live,
        },
      )}
    >
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
