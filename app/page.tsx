import LoginButton from '@/components/login-button';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Next.js',
};

export default function Page() {
  return (
    <div>
      <div className="flex">
        <h1>Hello, Next.js!</h1>
        <LoginButton></LoginButton>
      </div>
    </div>
  );
}
