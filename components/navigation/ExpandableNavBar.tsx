"use client";

import React, { ReactNode, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiMenu } from "react-icons/fi";
import { Logo } from "./Logo";
import { DesktopLinks } from "./DesktopLinks";
import { MobileLinks } from "./MobileLinks";
import { Announcement } from "./Announcement";
import { Button } from "../shared/Button";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { BsFillArrowRightSquareFill } from "react-icons/bs";

type LinkType = {
  title: string;
  sublinks: { title: string; href: string }[];
};

export const ExpandableNavBar = ({
  children,
  links,
  login,
}: {
  children?: ReactNode;
  links: LinkType[];
  login?: boolean;
}) => {
  const [hovered, setHovered] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const activeSublinks = useMemo(() => {
    if (!hovered) return [];
    const link = links.find((l) => l.title === hovered);

    return link ? link.sublinks : [];
  }, [hovered, links]);

  return (
    <>
      <div className="bg-indigo-600 pt-2">
        <Announcement />
        <nav
          onMouseLeave={() => setHovered(null)}
          className="rounded-t-2xl bg-white p-4"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start">
              <Logo />
              <DesktopLinks
                links={links}
                setHovered={setHovered}
                hovered={hovered}
                activeSublinks={activeSublinks}
              />
            </div>
            <div className="flex items-center gap-4">
              <Link href={login ? `/application/dashboard` : `/sign-in`}>
                <Button
                  className="hidden md:block cursor-pointer"
                  intent="secondary"
                  size="small"
                >
                  <span className="font-bold">
                    {login ? (
                      <span className="flex items-center gap-2">
                        Dashboard
                        <BsFillArrowRightSquareFill className="inline-block ml-1" />
                      </span>
                    ) : (
                      "Login"
                    )}{" "}
                  </span>
                </Button>
              </Link>
              {login && <UserButton />}
            </div>
            <button
              onClick={() => setMobileNavOpen((pv) => !pv)}
              className="mt-0.5 block text-2xl md:hidden"
            >
              <FiMenu />
            </button>
          </div>
          <MobileLinks links={links} open={mobileNavOpen} />
        </nav>
      </div>
      <motion.main layout>
        <div className="bg-white">{children}</div>
      </motion.main>
    </>
  );
};
