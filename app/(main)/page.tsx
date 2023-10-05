'use client';
import React, { useEffect, useState } from 'react';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loading from '@/components/common/Loading';
import { IStream } from '@/utils/interfaces/stream';
import { IRoute } from '@/utils/interfaces/system';
import StreamCard from '@/components/StreamCard';

const StreamPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [streams, setStreams] = useState<IStream[]>([]);
  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Streams', url: '' },
  ];

  useEffect(() => {
    async function init() {
      setIsLoading(true);
      const response = await fetch(
        `/api/v1/streams/viewable?page=${0}&limit=${100}`,
        { method: 'GET' },
      );

      const { data } = await response.json();
      setIsLoading(false);
      setStreams(data);
    }

    init();
  }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <Breadcrumb routes={routes} />
      </div>
      <div className="main">
        {isLoading ? (
          <Loading />
        ) : (
          <div className="flex gap-4">
            {streams.map((stream) => (
              <StreamCard data={stream} key={stream.id} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StreamPage;
