"use client";

import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth";
import { signUpSchema, type SignUpFormData } from "@/lib/validations";
import Logo from "@/assets/logo.svg";
import { GoArrowUpRight } from "react-icons/go";
import Image from "next/image";

function Page() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<SignUpFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      username: formData.get("username") as string,
    };

    // Client-side validation with Zod
    const validationResult = signUpSchema.safeParse(data);

    if (!validationResult.success) {
      const errors: Partial<SignUpFormData> = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          errors[error.path[0] as keyof SignUpFormData] = error.message;
        }
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      await signUp(validationResult.data);
      router.push("/sign-in");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center overflow-y-hidden">
      <Link href="/">
        <Image src={Logo} width={100} height={100} alt="Logo" />
      </Link>
      <div className="relative flex flex-col items-center justify-center z-10 bg-white border border-white/50 rounded-2xl shadow-md max-w-[400px] w-[90%] h-[550px]">
        <div>
          <h2 className="text-2xl font-medium">Sign Up</h2>
        </div>
        <div>
          <p className="text-gray-500 pt-1">to get started</p>
        </div>
        <div className="pt-6 w-full px-8">
          <form onSubmit={handleSignup} className="w-full px-10">
            <div className="mb-2 w-full">
              <input
                type="text"
                name="username"
                placeholder="Username"
                className={`bg-gray-100 text-[14px] rounded-md px-4 w-full h-[2.8rem] focus:outline-[#4B4EE7] placeholder:text-[15px] ${
                  fieldErrors.username ? "border-red-500 border" : ""
                }`}
              />
              {fieldErrors.username && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.username}
                </p>
              )}
            </div>
            <div className="mb-2 w-full">
              <input
                name="email"
                type="email"
                placeholder="Email"
                className={`bg-gray-100 text-[14px] rounded-md px-4 w-full h-[2.8rem] focus:outline-[#4B4EE7] placeholder:text-[15px] ${
                  fieldErrors.email ? "border-red-500 border" : ""
                }`}
              />
              {fieldErrors.email && (
                <p className="text-red-500 text-xs mt-1">{fieldErrors.email}</p>
              )}
            </div>
            <div className="mb-2 w-full">
              <input
                name="password"
                type="password"
                placeholder="Password"
                className={`bg-gray-100 text-[14px] rounded-md px-4 w-full h-[2.8rem] focus:outline-[#4B4EE7] placeholder:text-[15px] ${
                  fieldErrors.password ? "border-red-500 border" : ""
                }`}
              />
              {fieldErrors.password && (
                <p className="text-red-500 text-xs mt-1">
                  {fieldErrors.password}
                </p>
              )}
            </div>
            <div className="w-full">
              {error !== null ? (
                <p className="text-red-600 text-sm text-center mb-1 mt-1">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="flex items-center justify-center pt-4 pb-1 w-full">
              <div className="relative w-full group">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white bg-[#4B4EE7] rounded-md w-full py-2 transition-all duration-300 group-hover:pr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Saving..." : "Sign up"}
                </button>
                {!isLoading && (
                  <div className="absolute top-1/2 right-6 transform -translate-y-1/2 opacity-0 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0">
                    <GoArrowUpRight className="text-white" size={24} />
                  </div>
                )}
              </div>
            </div>
            <div className="w-full">
              <p className="text-[13px] pt-3">
                Have already account?{" "}
                <Link
                  href={"/sign-in"}
                  className="text-[#8276FF] transition-all"
                >
                  Sign in
                </Link>{" "}
              </p>
            </div>
          </form>
        </div>
      </div>
      <div className="relative z-0">
        <div className="w-32 h-32 bg-gradient-to-r from-[#8276FF] to-[#4B4EE7] blur-[200px] absolute inset-0"></div>
      </div>
    </div>
  );
}

export default Page;
