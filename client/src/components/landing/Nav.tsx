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
          <li className="text-neutral-900 hover:text-neutral-700 hover:cursor-pointer transition-all font-medium">
            <Link href={"/changelog"}>Changelog</Link>
          </li>
          <li className="bg-primary text-white px-4 py-1.5 rounded-2xl transition-all hover:scale-105 hover:cursor-pointer hover:-translate-y-0.5 font-medium">
            <Link href={"/sign-up"}>Start Now!</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Nav;
