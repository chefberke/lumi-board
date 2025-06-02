"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

import OnboardingLogo from "@/assets/logo_classic.svg";

const OnboardingGuide = () => {
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);

  const pages = [
    {
      title: "Welcome to Lumi!",
      content:
        "You're about to dive into Lumi, a simple and efficient kanban board system. Let's get started!",
      image: OnboardingLogo,
      color: "from-indigo-500 via-purple-500 to-pink-500",
    },
    {
      title: "Basic Shortcuts",
      content:
        "Discover essential shortcuts in Lumi to enhance your productivity. Get familiar with them quickly!",
      image: OnboardingLogo,
      color: "from-red-500 via-green-500 to-blue-500",
    },
    {
      title: "Tasks & Boards",
      content:
        "Explore Lumi's easy and effective ways to organize your tasks and projects.",
      image: OnboardingLogo,
      color: "from-orange-500 via-violet-500 to-yellow-500",
    },
    {
      title: "Ready to Go!",
      content:
        "Lumi is all set! Click 'Finish' to begin your journey and make the most of our app.",
      image: OnboardingLogo,
      color: "from-sky-500 via-blue-500 to-purple-500",
    },
  ];

  const handleNext = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handleFinish = () => {
    setCurrentPage(-1);
    const finished = true;
    localStorage.setItem("onboarding", JSON.stringify(finished));
  };

  useEffect(() => {
    const onboardingValue = localStorage.getItem("onboarding");
    if (onboardingValue) {
      setCurrentPage(-1);
    }
    setLoading(false);
  }, []);

  if (loading) return null;

  if (currentPage === -1) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white dark:bg-neutral-950 w-[470px] h-[440px] rounded-3xl p-8 shadow-lg flex-col items-center overflow-hidden">
        <div className="relative z-0">
          <div
            className={`absolute w-full h-20 bg-gradient-to-r ${pages[currentPage].color} blur-[100px]`}
          ></div>
        </div>
        <div className="h-[8rem] w-full flex items-center justify-center relative z-10">
          <motion.div
            key={currentPage}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0 }}
          >
            <Image
              src={pages[currentPage].image}
              width={60}
              height={60}
              alt="onboardinglogo"
            />
          </motion.div>
        </div>
        <motion.div
          key={currentPage}
          initial={{ translateX: -30 }}
          animate={{ translateX: 0 }}
        >
          <h2 className="text-xl font-medium mb-2 mt-12 dark:text-white">
            {pages[currentPage].title}
          </h2>
        </motion.div>
        <p className="mb-3 text-gray-600 dark:text-neutral-400 text-[15px]">
          {pages[currentPage].content}
        </p>

        <div className="mt-auto flex justify-between w-full pt-2">
          {currentPage < pages.length - 1 && (
            <button
              onClick={handleNext}
              className="bg-black dark:bg-neutral-800 px-5 py-1 text-white rounded-lg hover:bg-neutral-900 dark:hover:bg-neutral-700"
            >
              Next
            </button>
          )}

          {currentPage === pages.length - 1 && (
            <button
              onClick={handleFinish}
              className="bg-black dark:bg-neutral-800 px-5 py-1 text-white rounded-lg hover:bg-neutral-900 dark:hover:bg-neutral-700"
            >
              Finish
            </button>
          )}
        </div>
        <div className="flex items-center justify-center gap-1 mb-4 pt-10">
          <div
            className={`w-2 h-2 rounded-full ${
              currentPage >= 0 ? "bg-neutral-800" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentPage >= 1 ? "bg-neutral-800" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentPage >= 2 ? "bg-neutral-800" : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`w-2 h-2 rounded-full ${
              currentPage >= 3 ? "bg-neutral-800" : "bg-gray-300"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingGuide;
