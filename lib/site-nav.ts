// Site navigation, defined once and shared by the header, mobile drawer,
// and footer. Routes map to the App Router pages built in Phase C.

export type NavLink = { label: string; href: string };

export const primaryNav: NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Resources", href: "/resources" },
  { label: "Reading Plans", href: "/reading-plans" },
  { label: "Class Sessions", href: "/#sessions" },
  { label: "Media", href: "/media" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "Contact", href: "/contact" },
];

export const footerNav: { heading: string; links: NavLink[] }[] = [
  {
    heading: "Explore",
    links: [
      { label: "About OBS", href: "/about" },
      { label: "Resources", href: "/resources" },
      { label: "Reading Plans", href: "/reading-plans" },
      { label: "Podcasts & Media", href: "/media" },
    ],
  },
  {
    heading: "Get involved",
    links: [
      { label: "Events", href: "/events" },
      { label: "Community", href: "/community" },
      { label: "Volunteer", href: "/community/volunteer" },
      { label: "Join the team", href: "/community/team" },
    ],
  },
  {
    heading: "Ministry",
    links: [
      { label: "Statement of Faith", href: "/about#statement-of-faith" },
      { label: "Our Story", href: "/about#our-story" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    heading: "Stay connected",
    links: [
      { label: "Newsletter", href: "/#join" },
      { label: "Instagram", href: "https://www.instagram.com/openbibleschool/" },
      { label: "YouTube", href: "https://www.youtube.com/@studywithOBS" },
      {
        label: "Spotify — OBS Studio",
        href: "https://open.spotify.com/show/0G6DSKiA0fA6UYcxpEOcCl",
      },
    ],
  },
];
