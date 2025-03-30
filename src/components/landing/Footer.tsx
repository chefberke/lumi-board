import Link from "next/link";
import React from "react";
import Logo from "@/assets/logo.svg";
import Image from "next/image";

function Footer() {
  return (
    <div className="min-h-24 py-4 w-full flex items-center justify-center text-sm border-t border-t-neutral-100">
      <div className="flex flex-col md:flex-row items-center justify-between w-full px-4 md:px-8 gap-4 md:gap-0">
        <div>
          <Link href={"/"}>
            <Image src={Logo} width={80} height={80} alt="Logo" />
          </Link>
        </div>
        <div className="order-3 md:order-2">
          <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
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
        <div className="order-2 md:order-3">
          <p className="text-neutral-900 text-center md:text-right">© 2025 Lumi. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}

export default Footer;
