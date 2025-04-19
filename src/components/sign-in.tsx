"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import toast from "react-hot-toast";

export function Sign() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const res = await signIn("credentials", {
      email,
      password,
      redirect: true,
      callbackUrl: "/",
    });
    if (!res?.ok) {
      toast.error("Login failed! Check credentials.");
    } else {
      toast.success("Login successful!");
    }
  };

  const handlePasswordReset = async () => {
    if (!resetEmail || !newPassword) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        body: JSON.stringify({ email: resetEmail, newPassword }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Password reset successful!");
        setMessage(data.message);
      } else {
        toast.error(data.message || "Password reset failed.");
      }
    } catch (err) {
      console.error("Reset failed", err);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <Card className="w-full max-w-md border-none p-8 bg-white shadow-md rounded-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl text-center font-semibold text-gray-800">
            Sign In
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 h-[47px] text-base font-semibold"
            >
              Sign In
            </Button>

            {/* Forgot Password */}
            <div className="text-center mt-4">
              <Dialog>
                <DialogTrigger className="text-sm  text-blue-600 hover:underline">
                  Forgot Password?
                </DialogTrigger>
                <DialogContent className="space-y-4 bg-white">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                  </DialogHeader>

                  <div className="space-y-2">
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      placeholder="you@example.com"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>New Password</Label>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="New secure password"
                    />
                  </div>

                  <Button
                    className="w-full bg-blue-600"
                    onClick={handlePasswordReset}
                  >
                    Reset Password
                  </Button>
                </DialogContent>
              </Dialog>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
