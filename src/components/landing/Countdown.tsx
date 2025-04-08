"use client";

import React, { useState, useEffect, useRef } from "react";

function Countdown() {
  const targetDateRef = useRef<Date | null>(null);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const storedDate = localStorage.getItem("targetDate");
    if (!targetDateRef.current) {
      if (storedDate) {
        targetDateRef.current = new Date(storedDate);
      } else {
        const target = new Date();
        target.setDate(target.getDate() + 36);
        targetDateRef.current = target;
        localStorage.setItem("targetDate", target.toISOString());
      }
    }

    const calculateTime = () => {
      const now = new Date();
      const difference = targetDateRef.current!.getTime() - now.getTime();

      if (difference <= 0) {
        setIsExpired(true);
        return false;
      }

      const d = Math.floor(difference / (1000 * 60 * 60 * 24));
      const h = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(d);
      setHours(h);
      setMinutes(m);
      setSeconds(s);
      return true;
    };

    if (!calculateTime()) return;

    const interval = setInterval(calculateTime, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number): string => {
    return num < 10 ? `0${num}` : num.toString();
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="flex flex-wrap justify-center gap-4 text-center">
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-medium border border-gray-100 transition-all hover:shadow-lg hover:border-lumi hover:text-lumi">
            {formatNumber(days)}
          </div>
          <span className="text-sm mt-2 text-gray-600">Day</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-medium border border-gray-100 transition-all hover:shadow-lg hover:border-lumi hover:text-lumi">
            {formatNumber(hours)}
          </div>
          <span className="text-sm mt-2 text-gray-600">Hour</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-medium border border-gray-100 transition-all hover:shadow-lg hover:border-lumi hover:text-lumi">
            {formatNumber(minutes)}
          </div>
          <span className="text-sm mt-2 text-gray-600">Minute</span>
        </div>
        <div className="flex flex-col items-center">
          <div className="bg-white shadow-md rounded-lg w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center text-lg font-medium border border-gray-100 transition-all hover:shadow-lg hover:border-lumi hover:text-lumi">
            {formatNumber(seconds)}
          </div>
          <span className="text-sm mt-2 text-gray-600">Second</span>
        </div>
      </div>
    </div>
  );
}

export default Countdown;
