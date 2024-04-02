import type { Site, Page, Links, Socials } from "@types"

// Global
export const SITE: Site = {
  TITLE: "Niloy",
  DESCRIPTION: "I'm a software developer ",
  AUTHOR: "Mark Horn",
}

// Work Page
export const WORK: Page = {
  TITLE: "Work",
  DESCRIPTION: "Places I have worked.",
}

// Blog Page
export const BLOG: Page = {
  TITLE: "Blog",
  DESCRIPTION: "Writing on topics I am passionate about.",
}

// Projects Page 
export const PROJECTS: Page = {
  TITLE: "Projects",
  DESCRIPTION: "Recent projects I have worked on.",
}

// Search Page
export const SEARCH: Page = {
  TITLE: "Search",
  DESCRIPTION: "Search all posts and projects by keyword.",
}

// Links
export const LINKS: Links = [
  { 
    TEXT: "Home", 
    HREF: "/", 
  },
  { 
    TEXT: "Work", 
    HREF: "/work", 
  },
  { 
    TEXT: "Blog", 
    HREF: "/blog", 
  },
  { 
    TEXT: "Projects", 
    HREF: "/projects", 
  },
]

// Socials
export const SOCIALS: Socials = [
  { 
    NAME: "Email",
    ICON: "email", 
    TEXT: "nilooy.dev@gmail.com",
    HREF: "mailto:nilooy.dev@gmail.com",
  },
  { 
    NAME: "Github",
    ICON: "github",
    TEXT: "nilooy",
    HREF: "https://github.com/nilooy"
  },
  { 
    NAME: "LinkedIn",
    ICON: "linkedin",
    TEXT: "rezwanferdousniloy",
    HREF: "https://www.linkedin.com/in/rezwanferdousniloy",
  },
  { 
    NAME: "Twitter",
    ICON: "twitter-x",
    TEXT: "nil_ooy",
    HREF: "https://twitter.com/nil_ooy",
  },
]

