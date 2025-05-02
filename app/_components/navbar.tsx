"use client"

import dynamic from "next/dynamic";

const navbar = () => {

  const GooeyNav = dynamic(
    () => import("@/app/_components/GooeyNav/GooeyNav"),
    {
      ssr: false,
    }
  );

  // update with your own items
  const items = [
    { label: "Home", href: "#hello" },
    { label: "About", href: "#about" },
    { label: "Certifications", href: "#certifications" },
    { label: "Educations", href: "#educations" },
    { label: "Projects", href: "#projects" },
    { label: "Work Experience", href: "#work-experience" },
  ];

  return (
    <>
      <div className="fixed inset-0 flex justify-center mt-5 backdrop-blur-md">
        <GooeyNav
          items={items}
          particleCount={15}
          particleDistances={[90, 10]}
          particleR={100}
          initialActiveIndex={0}
          animationTime={600}
          timeVariance={300}
          colors={[1, 2, 3, 1, 2, 3, 1, 4]}
        />
      </div>
    </>
  );
}

export default navbar;