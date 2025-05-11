import Image from "next/image";
import dynamic from "next/dynamic";
import Link from "next/link";
import { PiGithubLogoLight } from "react-icons/pi";
import { FaLinkedin } from "react-icons/fa";

const Hello = () => {
  const BlurText = dynamic(
    () => import("@/app/_components/BlurText/BlurText"),
    {
      ssr: false,
    }
  );

  const handleAnimationComplete = () => {
    console.log("All letters have animated!");
  };

  return (
    <section id="hello">
      <div className="h-screen flex flex-col space-y-10 max-w-6xl mx-auto mb-20">
        <div className="flex flex-row justify-between my-10 text-3xl font-bold text-[#0f172a] dark:text-[#e2e8f0]">
          <p>My Portofolio</p>
          <div className="flex flex-row space-x-10">
            {/* <Link
              href={"/blog"}
              className="text-sm font-bold text-[#0f172a] dark:text-[#e2e8f0] hover:underline">
              Read My Blog
            </Link> */}
            <Link
              href={"https://linkedin.com/in/sayidm"}
              target="_blank"
              rel="noopener noreferrer">
              <FaLinkedin />
            </Link>
            <Link
              href={"https://github.com/MuhammadJundullah"}
              target="_blank"
              rel="noopener noreferrer">
              <PiGithubLogoLight />
            </Link>
          </div>
        </div>

        <div className="flex flex-row items-center justify-center space-x-10 pt-10 mt-32">
          {/* IMAGE */}
          <div className="min-w-[400px] min-h-[400px] flex justify-center items-center">
            <Image
              src="/static-image/ahmad.jpg"
              alt="Ahmad"
              width={300}
              height={300}
              className="rounded-full border-2 border-[#0f172a] shadow-lg shadow-[#0f172a] hover:shadow-[0_0_20px_5px_#0f172a] transition-all duration-300 ease-in-out"
            />
          </div>

          {/* TEXT */}
          <div className="flex-1 flex justify-center items-center min-h-[400px]">
            <BlurText
              text="Hi There, I'am Sayid Muhammad Jundullah, Web Developer & Data Enthusiast."
              delay={200}
              animateBy="words"
              direction="bottom"
              onAnimationComplete={handleAnimationComplete}
              className="text-3xl font-medium text-center text-[#0f172a] dark:text-[#e2e8f0] max-w-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hello;
