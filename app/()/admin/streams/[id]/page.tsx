'use client';
import * as _ from 'lodash';
import AsyncSelect from 'react-select/async';
import StreamForm from '@/components/StreamForm';
import Breadcrumb from '@/components/common/Breadcrumb';
import Loading from '@/components/common/Loading';
import { StatusEnum } from '@/utils/enums';
import { ICluster } from '@/utils/interfaces/cluster';
import { IStream, IStreamViewer } from '@/utils/interfaces/stream';
import { IRoute } from '@/utils/interfaces/system';
import { IUser } from '@/utils/interfaces/user';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import { SelectOption } from '@/utils/interfaces/react-select';
import { MultiValue } from 'react-select';

function Page({ params }: { params: { id: string } }) {
  const [stream, setStream] = useState<IStream>();
  const [viewers, setViewers] = useState<SelectOption[]>([]);
  const [settingStream, setSettingStream] = useState<any>()
  const [clusters, setClusters] = useState<ICluster[]>([]);
  const [isGrading, setIsGrading] = useState<boolean>(false);
  const [error, setError] = useState('');

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '/admin/streams' },
    { title: 'Update Stream', url: '' },
  ];

  useEffect(() => {
    const fetchClusters = async () => {
      const response = await fetch(`/api/v1/clusters`, { method: 'GET' });
      const data = await response.json();

      setClusters(data);
    };

    const fetchSetting = async () => {
      const response = await fetch(`/api/v1/settings`, { method: 'GET' });
      const data = await response.json();

      setSettingStream(data.streams);
    };

    const fetchStream = async () => {
      const response = await fetch(`/api/v1/streams/${params.id}`, {
        method: 'GET',
      });
      const streamObject: IStream = await response.json();

      setStream(streamObject);
    };

    fetchStream();
    fetchSetting();
    fetchClusters();
  }, [params.id]);

  useEffect(() => {
    if (stream?.streamViewers) {
      const defaultUsers =
        stream?.streamViewers?.reduce(
          (acc: SelectOption[], item: IStreamViewer) => {
            if (item.status === StatusEnum.Active && item.viewer) {
              const option: SelectOption = {
                value: item.viewer.id,
                label: `${item.viewer.firstName} ${item.viewer.lastName}`,
                isDisabled: false,
              };

              acc.push(option);
            }

            return acc;
          },
          [],
        ) ?? [];

      setViewers(defaultUsers);
    }
  }, [stream]);

  const loadUserOptions = (inputValue: string): Promise<SelectOption[]> =>
    fetch(`/api/v1/users?limit=500&search=${inputValue}`, {
      method: 'GET',
    }).then(async (res) => {
      if (!res.ok) {
        return [];
      }

      const { data } = await res.json();
      return data?.map(
        (item: IUser): SelectOption => ({
          value: item.id,
          label: `${item.firstName} ${item.lastName}`,
          isDisabled: false,
        }),
      );
    });

  const onUpdate = (body: string): Promise<Response> => {
    return fetch(`/api/v1/streams/${params.id}`, { method: 'PATCH', body });
  };

  const onSuccess = (): void => {
    toast.success('Update stream successfully');
  };

  const onGrandChange = (newValue: MultiValue<SelectOption>): void => {
    if(viewers.length < settingStream?.maxViewersPerStream) {
      setViewers([...newValue]);
    } else {
      setError('You can only select up to 5 people!')
    }
  };

  const onGrandeViewAccess = async (): Promise<void> => {
    setIsGrading(true);

    const records = viewers.map((item: SelectOption) => ({
      status: StatusEnum.Active,
      user: { id: item.value },
    }));

    const response = await fetch(`/api/v1/streams/${params.id}/access`, {
      method: 'POST',
      body: JSON.stringify({ records }),
    });

    setIsGrading(false);
    if (!response.ok) {
      toast.error('Grand user access to stream failed');
      return;
    }
    toast.success('Grand user access to stream successfully');
  };

  const onFail = (errors: any): void => {
    toast.error('Update stream failed');
  };

  if (!stream) {
    return <Loading />;
  }

  return (
    <div className="p-4">
      <Breadcrumb routes={routes} />
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">Update stream</h3>
        <StreamForm
          initData={stream}
          clusters={clusters}
          onSubmit={onUpdate}
          onSuccess={onSuccess}
          onFail={onFail}
        />
      </div>
      <div className="border-solid border-2 rounded-md p-4 mt-4">
        <h3 className="pb-4 font-bold text-lg">View access</h3>
        <AsyncSelect
          isMulti
          cacheOptions
          defaultOptions
          value={viewers}
          onChange={onGrandChange}
          loadOptions={loadUserOptions}
        />
        <span className='text-red-500 my-2 block'>{error}</span>
        <div className="flex mt-4 justify-end gap-4 w-full">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onGrandeViewAccess}
            disabled={isGrading}
          >
            {isGrading ? 'Grading...' : 'Grand Access'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;
