import Image from "next/image";
import React from "react";
import Logo from "@/assets/logo.svg";
import Link from "next/link";

function Nav() {
  return (
    <div className="flex items-center justify-between w-full h-24">
      <Link href={"/"}>
        <Image src={Logo} width={100} height={100} alt="Logo" />
      </Link>
      <div>
        <ul className="flex items-center gap-8">
          <li className="text-neutral-900 hover:text-neutral-700 hover:cursor-pointer transition-all">
            Features
          </li>
          <li className="text-neutral-900 hover:text-neutral-700 hover:cursor-pointer transition-all">
            Pricing
          </li>
          <li className="text-neutral-900 hover:text-neutral-700 hover:cursor-pointer transition-all">
            Team
          </li>
          <li className="bg-primary text-white px-4 py-2 rounded-xl">
            Start Now!
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
