"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "@/lib/auth";
import { setUser } from "@/lib/authClient";
import { signInSchema, type SignInFormData } from "@/lib/validations";
import Logo from "@/assets/logo.svg";

import { GoArrowUpRight } from "react-icons/go";

function SignIn() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<SignInFormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setFieldErrors({});
    setIsLoading(true);

    const formData = new FormData(e.target as HTMLFormElement);
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    };

    // Client-side validation with Zod
    const validationResult = signInSchema.safeParse(data);

    if (!validationResult.success) {
      const errors: Partial<SignInFormData> = {};
      validationResult.error.errors.forEach((error) => {
        if (error.path[0]) {
          errors[error.path[0] as keyof SignInFormData] = error.message;
        }
      });
      setFieldErrors(errors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await signIn(validationResult.data);
      setUser({ email: validationResult.data.email, id: response.user._id });
      router.push("/dashboard");
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
      <div className="mb-12">
        <Link href="/">
          <Image src={Logo} width={100} height={100} alt="Logo" />
        </Link>
      </div>
      <div className="relative flex flex-col items-center justify-center z-10 bg-white border border-white/50 rounded-2xl shadow-md max-w-[400px] w-[90%] h-[450px]">
        <div>
          <h2 className="text-2xl font-medium">Login</h2>
        </div>
        <div>
          <p className="text-gray-500 pt-1">to get started</p>
        </div>
        <div className="pt-6 w-full px-8">
          <form onSubmit={handleSignIn} className="w-full px-10">
            <div className="mb-2 w-full">
              <input
                name="email"
                required
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
                required
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
            <div>
              {error !== null ? (
                <p className="text-red-600 text-sm text-center mb-4 mt-1">
                  {error}
                </p>
              ) : null}
            </div>
            <div className="w-full">
              <p className="text-[#8276FF] text-[13px] cursor-pointer">
                Forget Password?
              </p>
            </div>
            <div className="flex items-center justify-center pt-4 pb-1 w-full">
              <div className="relative w-full group">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="text-white bg-[#4B4EE7] rounded-md w-full py-2 transition-all duration-300 group-hover:pr-4 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Loading..." : "Sign in"}
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
                Don&apos;t have an account?{" "}
                <Link
                  href={"/sign-up"}
                  className="text-[#8276FF] transition-all"
                >
                  Sign up
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

export default SignIn;
