"use client";

import React from "react";
import { motion } from "framer-motion";
import { IntegrationsBlock } from "./IntegrationsBlock";
import { CollaborateBlock } from "./CollaborateBlock";
import { HighlighBlocks } from "./HighlighBlocks";
import { SectionHeading } from "../shared/SectionHeading";
import { SectionSubheading } from "../shared/SectionSubheading";
import { Button } from "../shared/Button";

export const BenefitsGrid = () => {
  return (
    <motion.section
      transition={{
        staggerChildren: 0.1,
      }}
      initial="initial"
      whileInView="whileInView"
      className="relative mx-auto grid max-w-6xl grid-cols-3 gap-4 px-2 md:px-4"
    >
      <div className="col-span-3">
        <SectionHeading>The clear benefits of Grocy</SectionHeading>
        <SectionSubheading>
          Grocy is a powerful tool that helps you manage your groceries and
          expenses with ease. Here are some of the benefits you can expect.
        </SectionSubheading>
      </div>
      <IntegrationsBlock />
      <CollaborateBlock />
      <HighlighBlocks />
      <div className="col-span-3 mt-6 flex justify-center">
        <Button intent="outline">
          <span className="font-bold">Get started - </span> for free
        </Button>
      </div>
    </motion.section>
  );
};
