
// import dynamic from 'next/dynamic';
import { SiAboutdotme } from 'react-icons/si';
import { useRef } from "react";
import VariableProximity from "@/app/_components/VariableProximity/VariableProximity";

const About = () => {
  const containerRef = useRef(null);

  // const ScrollReveal = dynamic(
  //   () => import("@/app/_components/ScrollReveal/ScrollReveal"),
  //   {
  //     ssr: false,
  //   }
  // );

  // const VariableProximity = dynamic(
  //   () => import("@/app/_components/VariableProximity/VariableProximity"),
  //   {
  //     ssr: false,
  //   }
  // );

  return (
    <section id="About">
      <div className="h-screen flex flex-col max-w-5xl mx-auto mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <SiAboutdotme className="text-9xl mx-auto" />
        {/* <ScrollReveal
          baseOpacity={8}
          enableBlur={true}
          baseRotation={2}
          blurStrength={2}
          textClassName="font-thin text-4xl">
          I am a 6th-semester Informatics Engineering student with an interest
          in web development and data-related fields. I have experience in web
          development, as well as skills in dashboard creation and data
          prediction. I am open to remote freelance projects and ready to join a
          team to work while continuously learning together.
        </ScrollReveal> */}
        <div ref={containerRef} style={{ position: "relative" }}>
          <VariableProximity
            label={
              "I am a 6th-semester Informatics Engineering student with an interest in web development and data-related fields. I have experience in web development, as well as skills in dashboard creation and data prediction. I am open to remote freelance projects and ready to join a team to work while continuously learning together."
            }
            className={"variable-proximity-demo"}
            fromFontVariationSettings="'wght' 400, 'opsz' 9"
            toFontVariationSettings="'wght' 1000, 'opsz' 40"
            containerRef={containerRef}
            radius={100}
            falloff="linear"
          />
        </div>
      </div>
    </section>
  );
};

export default About;






