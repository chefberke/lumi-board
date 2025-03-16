import Link from "next/link";
import React from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";

function Footer() {
  return (
    <div className="h-24 w-full flex items-center justify-center text-sm border-t border-t-neutral-100">
      <div className="flex items-center justify-between w-full">
        <div>
          <Link href={"/"}>
            <Image src={Logo} width={80} height={80} alt="Logo" />
          </Link>
        </div>
        <div>
          <ul className="flex items-center gap-8">
            <li className="text-neutral-900 hover:text-neutral-700 hover:cursor-pointer transition-all">
              <Link href={"https://github.com/lumi-work"}>Github</Link>
            </li>
            <li className="text-neutral-900 hover:text-neutral-700 hover:cursor-pointer transition-all">
              <Link href={"https://twitter.com/works_lumi"}>Twitter</Link>
            </li>
            <li className="text-neutral-900 hover:text-neutral-700 hover:cursor-pointer transition-all">
              <Link href={"https://www.producthunt.com/@lumiworks"}>
                Product Hunt
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <p className="text-neutral-900">© 2025 Lumi. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
