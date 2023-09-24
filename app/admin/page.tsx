import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin only',
};

export default function AdminPage() {
  return (
    <div>
      <div className="flex">
        <h1>Hello, Next.js!</h1>
      </div>
    </div>
  );
}
