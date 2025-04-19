"use client";
import { toast } from "react-hot-toast";

import { useSession, signOut } from "next-auth/react";
import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

export default function FeedPage() {
  const { data: session } = useSession();
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const email = session?.user?.email ?? "U";
  const initial = email[0]?.toUpperCase() ?? "U";
  const [form, setForm] = useState({
    title: "",
    content: "",
    isPublic: true,
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await fetch("/api/getpost");
        const posts = await res.json();
        setData(posts);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/post", {
        method: "POST",
        body: JSON.stringify({
          title: form.title,
          content: form.content,
          isPublic: form.isPublic,
          userId: session?.user?.id,
        }),
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        const errorData = await res.json();
        toast.error(errorData.message || "Failed to create post.");
        return;
      }

      const newPost = await res.json();
      setData((prev) => [newPost, ...prev]);
      setOpen(false);
      setForm({ title: "", content: "", isPublic: true });
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const getInitial = (email: string) => email?.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white px-6 py-8">
      {/* Top Navigation */}
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-3xl font-bold text-gray-800">📢 Feed</h1>

        <div className="flex items-center gap-4">
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 text-white hover:bg-blue-700 shadow">
                + New Post
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] rounded-xl bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl">Create a New Post</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Post Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                />
                <Textarea
                  placeholder="Write something..."
                  name="content"
                  rows={4}
                  value={form.content}
                  onChange={handleChange}
                />
                <div className="flex items-center gap-2">
                  <Switch
                    id="isPublic"
                    checked={form.isPublic}
                    onCheckedChange={(val) =>
                      setForm({ ...form, isPublic: val })
                    }
                  />
                  <label htmlFor="isPublic" className="text-sm text-gray-600">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={form.isPublic}
                      onChange={(e) =>
                        setForm({ ...form, isPublic: e.target.checked })
                      }
                      className="mr-2"
                    />
                    {form.isPublic ? "Public" : "Private"}
                  </label>
                </div>
              </div>
              <DialogFooter className="pt-4">
                <Button
                  className="w-full bg-blue-500 cursor-pointer"
                  onClick={handleSubmit}
                >
                  Post
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* Profile Avatar & Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger>
              <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center text-lg font-semibold cursor-pointer hover:ring-2 ring-blue-300 transition">
                {initial}
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="rounded-lg shadow-md">
              <DropdownMenuItem>
                <Link href="/profile">Profile</Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
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
  );
}
