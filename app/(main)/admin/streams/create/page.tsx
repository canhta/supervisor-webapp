'use client';
import Breadcrumb from '@/components/common/Breadcrumb';
import { Input } from '@/components/common/Input';
import Loading from '@/components/common/Loading';
import { Select } from '@/components/common/Select';
import { CreateStreamDto } from '@/utils/interfaces/stream';
import { IRoute } from '@/utils/interfaces/system';
import { FormEvent, Suspense, useEffect, useState } from 'react';
import { ICluster } from '@/utils/interfaces/cluster';
import Link from 'next/link';

const CreateStreamPage = () => {
  const [clusters, setClusters] = useState<ICluster[]>([]);
  const [formData, setFormData] = useState<CreateStreamDto>({
    name: '',
    location: '',
    clusterID: undefined,
  });
  const [errors, setErrors] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchClusters = async () => {
      const response = await fetch(`/api/clusters`, { method: 'GET' });
      const data = await response.json();

      setClusters(data);
    };

    fetchClusters();
  }, []);

  const routes: IRoute[] = [
    { title: 'Home', url: '/' },
    { title: 'Stream Management', url: '/admin/streams' },
    { title: 'Create New Stream', url: '' },
  ];

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setErrors({});

    try {
      const cluster = clusters.find(
        (cluster) => cluster.id === Number(formData.clusterID),
      );

      if (!cluster) {
        return setErrors({
          ...errors,
          clusterID: 'Please select a cluster',
        });
      }

      const response = await fetch('/api/streams', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          cluster,
        }),
      });

      if (!response.ok) {
        return setErrors(await response.json());
      }

      const data = await response.json();
      alert('Create stream successfully! (TODO: using toast)');
    } catch (error: any) {
      setErrors(error.message);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense fallback={<Loading />}>
      {
        <div className="p-4">
          <Breadcrumb routes={routes} />
          <h3 className="py-4 font-bold text-lg">Create new stream</h3>
          <form onSubmit={onSubmit} className="form w-full">
            <div className="flex gap-4">
              <Input
                name="name"
                label="Name"
                type="text"
                value={formData.name}
                onChange={handleInputChange}
                error={errors['name']}
              />
              <Select
                name="clusterID"
                label="Cluster"
                type="text"
                options={
                  clusters?.map((cluster) => ({
                    name: cluster.domain,
                    value: cluster.id,
                  })) ?? []
                }
                value={formData.clusterID}
                onChange={handleInputChange}
                error={errors['clusterID']}
              />
            </div>
            <Input
              name="location"
              label="Location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              error={errors['location']}
            />

            <div className="flex mt-4 justify-end gap-4 w-full">
              <Link type="button" className="btn " href={'/admin/streams'}>
                Back
              </Link>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? 'Loading...' : 'Submit'}
              </button>
            </div>
          </form>
        </div>
      }
    </Suspense>
  );
};

export default CreateStreamPage;
