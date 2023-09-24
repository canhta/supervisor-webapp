'use client';

import { Session } from 'next-auth';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Header({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();

  const routes: { title: string; url: string }[] = [
    { title: 'Users', url: '/admin/users' },
    { title: 'Side bar item 2', url: '/sidebar-2' },
    { title: 'Side bar item 3', url: '/sidebar-3' },
  ];

  const userRoutes: { title: string; url: string }[] = [
    { title: 'Side bar item 1', url: '/sidebar-1' },
    { title: 'Side bar item 2', url: '/sidebar-2' },
    { title: 'Side bar item 3', url: '/sidebar-3' },
  ];

  const getAvatarLetters = (session: Session | null): string => {
    if (session) {
      const { firstName, lastName } = session.user as any;
      return firstName?.[0] + lastName?.[0];
    }
    return '?';
  };

  return (
    <div className="drawer">
      <input id="my-drawer-3" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col">
        {/* Navbar */}
        <div className="w-full navbar bg-base-300">
          <div className="flex-none lg:hidden">
            <label htmlFor="my-drawer-3" className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block w-6 h-6 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <Link href="/">{'Supervisor'}</Link>
          </div>
          <div className="flex-none hidden lg:block">
            <ul className="menu menu-horizontal">
              {routes.map((route) => (
                <li key={route.url}>
                  <Link href={route.url}>{route.title}</Link>
                </li>
              ))}
              {!session && (
                <li>
                  <button onClick={() => signIn()}>{'Sign in'}</button>
                </li>
              )}
            </ul>
          </div>
          {session && (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="btn btn-ghost btn-circle avatar placeholder"
              >
                <div className="bg-neutral-focus text-neutral-content rounded-full w-8">
                  <span className="text-xs">{getAvatarLetters(session)}</span>
                </div>
              </label>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                {userRoutes.map((route) => (
                  <li key={route.url}>
                    <Link href={route.url}>{route.title}</Link>
                  </li>
                ))}
                <li>
                  <button onClick={() => signOut()}>{'Sign out'}</button>
                </li>
              </ul>
            </div>
          )}
        </div>
        <main className="p-4">{children}</main>
      </div>
      <div className="drawer-side">
        <label htmlFor="my-drawer-3" className="drawer-overlay"></label>
        <ul className="menu p-4 w-80 min-h-full bg-base-200">
          {routes.map((route) => (
            <li key={route.url}>
              <Link href={route.url}>{route.title}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
