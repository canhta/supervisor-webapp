import Loading from '@/components/Loading';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Admin only',
};

export default function UserPage() {
  return <Suspense fallback={<Loading />}>{/* <PostFeed /> */}</Suspense>;
}
