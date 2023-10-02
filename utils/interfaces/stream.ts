import { StatusEnum, StreamStatusEnum } from '../enums';
import { ICluster } from './cluster';
import { IUser } from './user';

export interface IStreamViewer {
  viewerID: string;
  viewer?: IUser;

  streamID: string;
  status: StatusEnum;
}

export interface IStream {
  name?: string;
  address?: string;
  cluster?: ICluster;

  id: string;
  status: StreamStatusEnum;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  streamViewers?: IStreamViewer[];
  __entity: string;
}

export interface CreateStreamDto
  extends Omit<
    IStream,
    'id' | 'status' | 'createdAt' | 'updatedAt' | 'deletedAt' | '__entity'
  > {
  clusterID?: any;
}
