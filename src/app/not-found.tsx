"use client";

import Image from "next/image";
import NotFoundImage from "@/assets/404_image.svg";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();
  return (
    <div className="w-full h-screen flex items-center justify-center flex-col">
      <Image src={NotFoundImage} width={500} height={500} alt="Not Found" />
      <h2 className="font-black text-6xl">Not Found</h2>
      <p className="text-neutral-500 pt-2 font-medium">
        Could not find requested resource
      </p>
      <div className="pt-8">
        <button
          onClick={() => router.back()}
          className="text-2xl font-bold hover:text-neutral-800 transition-all"
        >
          Go Back!
        </button>
      </div>
    </div>
  );
}
