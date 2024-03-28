"use client";

import clsx from "clsx";
import Link from "next/link";
import { useState } from "react";

interface Props {
  lists: {
    href: string;
    icon: JSX.Element;
    text: string;
  }[];
  children: React.ReactNode;
}

const SideBar = ({ lists, children }: Props) => {
  const [open, setOpen] = useState(false);
  const handleClick = () => setOpen(!open);

  return (
    <div>
      <button
        data-drawer-target="separator-sidebar"
        data-drawer-toggle="separator-sidebar"
        aria-controls="separator-sidebar"
        type="button"
        className="z-10 inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
        onClick={handleClick}
      >
        <span className="sr-only">Open sidebar</span>
        <svg
          className="w-6 h-6"
          aria-hidden="true"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            clipRule="evenodd"
            fillRule="evenodd"
            d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"
          ></path>
        </svg>
      </button>

      <aside
        id="separator-sidebar"
        className={clsx(
          "fixed top-14 left-0 z-40 w-64 h-screen transition-transform",
          open ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            {lists.map((list) => (
              <li key={list.text} onClick={() => setOpen(false)}>
                <Link href={list.href}>
                  <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                    <div className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                      {list.icon}
                    </div>
                    <span className="ms-3">{list.text}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div
        className="p-4 sm:ml-64 bg-gray-50 dark:bg-gray-800 min-h-screen"
        onClick={() => setOpen(false)}
      >
        {children}
      </div>
    </div>
  );
};

export default SideBar;
