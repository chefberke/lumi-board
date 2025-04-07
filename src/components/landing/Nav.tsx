import Image from "next/image";
import React from "react";
import Logo from "@/assets/logo.svg";
import Link from "next/link";

function Nav() {
  return (
    <div className="flex items-center justify-between w-full h-24">
      <Link href={"/"}>
        <Image src={Logo} width={85} height={85} alt="Logo" />
      </Link>
      <div>
        <ul className="flex items-center gap-8">
          <li className="relative group overflow-hidden bg-gradient-to-r from-[#8276FF] to-[#4B4EE7] text-white px-4 py-1.5 rounded-2xl transition-all duration-300 hover:shadow-lg hover:shadow-[#4B4EE7]/20 hover:-translate-y-0.5">
            <div className="absolute inset-0 bg-gradient-to-r from-[#4B4EE7] to-[#8276FF] opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
            <Link
              href={"/sign-up"}
              className="relative z-10 flex items-center gap-1 font-semibold"
            >
              Start Now
              <svg
                className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
