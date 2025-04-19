"use client";
import { useSession } from "next-auth/react";
import React from "react";
import { signOut } from "next-auth/react";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
const Page = () => {
  const { data: session, status } = useSession();
  const [data, setData] = React.useState<any[]>([]);

  const email = session?.user?.email ?? "U";
  const initial = email[0]?.toUpperCase() ?? "U";

  React.useEffect(() => {
    const getData = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/getpost/${session.user.id}`);
        const posts = await res.json();

        if (Array.isArray(posts)) {
          setData(posts);
        } else {
          console.error("Expected posts to be an array:", posts);
          setData([]);
        }
      } catch (error) {
        console.error("Failed to fetch posts", error);
        setData([]);
      }
    };

    getData();
  }, [session]);

  if (status === "loading") return <p>Loading...</p>;

  return (
    <div className="">
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-8">
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">Profile</h1>

          <div className="flex items-center gap-4">
            {/* Profile Avatar & Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-semibold cursor-pointer hover:ring-2 ring-blue-300 transition">
                  {initial}
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-lg shadow-md">
                <DropdownMenuItem>
                  <Link href="/">Feed</Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => signOut({ redirectTo: "/login" })}
                >
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Posts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data
            ?.filter((item: any) => item.isPublic)
            .map((item: any) => (
              <div
                key={item.id}
                className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-all"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {item.title}
                </h2>
                <p className="text-gray-600">{item.content}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Page;
