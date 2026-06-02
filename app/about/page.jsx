export const revalidate = 300;

import AboutMe from "../link/page";

export const metadata = {
  title: "About Me",
  description:
    "Learn more about Mutasim Fuad Rimu (Rimu Bhai), his background, skills, and full stack web development expertise.",
};

export default function About() {
  return (
    <div className="">
      <div className="pt-16 md:pt-20">
        <AboutMe />
      </div>
      
    </div>
  );
}
