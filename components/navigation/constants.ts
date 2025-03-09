export const NAV_LINKS = [
  {
    title: "Documentation",
    sublinks: [
      {
        title: "Docs 1",
        href: "#",
      },
      {
        title: "Docs 2",
        href: "#",
      },
    ],
  },
  {
    title: "Pricing",
    sublinks: [
      {
        title: "Pricing 1",
        href: "#",
      },
      {
        title: "Pricing 2",
        href: "#",
      },
      {
        title: "Pricing 3",
        href: "#",
      },
    ],
  },
];

export type LinkType = {
  title: string;
  sublinks: { title: string; href: string }[];
};
