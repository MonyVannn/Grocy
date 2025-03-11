import React from "react";
import { Block } from "./Block";
import {
  FiArrowUpRight,
  FiClipboard,
  FiCoffee,
  FiDollarSign,
  FiFeather,
  FiInbox,
  FiMove,
  FiRepeat,
  FiSmile,
} from "react-icons/fi";
import { IconType } from "react-icons";
import { twMerge } from "tailwind-merge";
import { CardTitle } from "./CardTitle";
import { CardSubtitle } from "./CardSubtitle";

export const HighlighBlocks = () => {
  return (
    <>
      <HighlightBlock
        Icon={FiDollarSign}
        iconClassName="text-green-500"
        title="Expense Tracking Made Simple"
        subtitle="Keep track of all grocery expenses in one place, allowing for better budgeting and financial planning."
      />
      <HighlightBlock
        Icon={FiArrowUpRight}
        iconClassName="text-pink-500"
        title="Fair Cost Sharing"
        subtitle="Automatically calculate and split grocery costs among family members or roommates, ensuring everyone contributes fairly."
      />
      <HighlightBlock
        Icon={FiSmile}
        iconClassName="text-blue-500"
        title="Collaborative Meal Planning"
        subtitle="Plan meals together with your group, making it easy to coordinate shopping and cooking efforts."
      />
      <HighlightBlock
        Icon={FiCoffee}
        iconClassName="text-orange-500"
        title="Real-Time Updates"
        subtitle="Receive real-time updates on grocery lists and expenses, so everyone stays informed and involved."
      />
      <HighlightBlock
        Icon={FiFeather}
        iconClassName="text-zinc-500"
        title="Customizable Ownership"
        subtitle="Assign ownership of grocery items to specific members, making it clear who is responsible for what."
      />
      <HighlightBlock
        Icon={FiInbox}
        iconClassName="text-purple-500"
        title="Analytics Dashboard"
        subtitle="Gain insights into your spending habits with an analytics dashboard that tracks total expenses, average spending, and individual contributions."
      />
      <HighlightBlock
        Icon={FiMove}
        iconClassName="text-fuchsia-500"
        title="User-Friendly Interface"
        subtitle="Enjoy a clean and intuitive interface that makes grocery management accessible for everyone, regardless of tech-savviness."
      />
      <HighlightBlock
        Icon={FiClipboard}
        iconClassName="text-red-500"
        title="Recipe Management (Future Feature)"
        subtitle="Easily save and share recipes, linking them to grocery items for a seamless cooking experience."
      />
      <HighlightBlock
        Icon={FiRepeat}
        iconClassName="text-yellow-500"
        title="Mobile Accessibility"
        subtitle="Access Grocy on your mobile device, allowing you to manage groceries and expenses on the go."
      />
    </>
  );
};

type Props = {
  Icon: IconType;
  iconClassName: string;
  title: string;
  subtitle: string;
};

const HighlightBlock = ({ iconClassName, Icon, title, subtitle }: Props) => (
  <Block className="col-span-3 space-y-1.5 md:col-span-1">
    <Icon className={twMerge("text-3xl text-indigo-600", iconClassName)} />
    <CardTitle>{title}</CardTitle>
    <CardSubtitle>{subtitle}</CardSubtitle>
  </Block>
);
