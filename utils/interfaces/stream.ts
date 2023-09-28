import { StreamStatusEnum } from '../enums';
import { ICluster } from './cluster';
import { IUser } from './user';

export interface IStream {
  name?: string;
  location?: string;
  cluster?: ICluster;

  id: string;
  status: StreamStatusEnum;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  streamViewers?: IUser[];
  __entity: string;
}

export interface CreateStreamDto
  extends Omit<
    IStream,
    'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt' | '__entity'
  > {
  clusterID?: any;
}
