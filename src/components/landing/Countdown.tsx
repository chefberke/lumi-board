"use client";

import React, { useState, useEffect } from "react";

function Countdown() {
  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + 1);
  targetDate.setDate(targetDate.getDate() + 7);

  const [days, setDays] = useState(0);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        clearInterval(interval);
        setIsExpired(true);
        return;
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
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

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
