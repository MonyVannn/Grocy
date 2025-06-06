"use client";

import React, { useEffect, useRef } from "react";
import { animate, useInView } from "framer-motion";

export const Stats = () => {
  return (
    <section className="mx-auto max-w-5xl px-4">
      <div className="flex flex-col items-center justify-center gap-12 sm:flex-row sm:gap-0">
        <Stat num={1400} suffix="+" subheading="Active Family Members" />
        <Stat num={2500} suffix="+" subheading="Grocery Items Managed" />
        <Stat num={15000} suffix="$" subheading="Total Expenses Tracked" />
      </div>
    </section>
  );
};

interface Props {
  num: number;
  suffix: string;
  decimals?: number;
  subheading: string;
}

const Stat = ({ num, suffix, decimals = 0, subheading }: Props) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    animate(0, num, {
      duration: 1.5,
      onUpdate(value) {
        if (!ref.current) return;

        ref.current.textContent = value.toFixed(decimals);
      },
    });
  }, [num, decimals, isInView]);

  return (
    <div className="flex w-full flex-col items-center">
      <p className="mb-2 text-center text-5xl font-medium">
        <span ref={ref}></span>
        {suffix}
      </p>
      <p className="text-center text-xl font-medium">{subheading}</p>
    </div>
  );
};
