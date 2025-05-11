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
      <div className="h-screen flex flex-col sm:space-y-10 max-w-6xl sm:mb-20 sm:mx-auto mx-5">
        <div className="flex flex-row justify-between sm:my-10 my-5 sm:text-3xl text-2xl font-bold text-gray-900 dark:text-gray-200">
          <p>My Portfolio</p>
          <div className="flex flex-row sm:space-x-10 space-x-4">
            <Link
              href={"https://linkedin.com/in/sayidm"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              <FaLinkedin />
            </Link>
            <Link
              href={"https://github.com/MuhammadJundullah"}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 hover:text-gray-700 dark:hover:text-gray-400 transition-colors">
              <PiGithubLogoLight />
            </Link>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center space-y-5 sm:space-y-0 sm:space-x-10 sm:pt-10 sm:mt-32 mt-10">
          {/* IMAGE */}
          <div className="sm:min-w-[400px] sm:min-h-[400px] min-w-[200px] min-h-[200px] flex justify-center items-center">
            <Image
              src="/static-image/ahmad.png"
              alt="Ahmad"
              width={200}
              height={200}
              className="rounded-full border-gray-900 dark:border-gray-200 shadow-lg shadow-gray-900 dark:shadow-gray-200 transition-all duration-300 ease-in-out sm:w-[300px] sm:h-[300px]"
              // className="rounded-full border-gray-900 dark:border-gray-200 shadow-lg shadow-gray-900 dark:shadow-gray-200 hover:shadow-[0_0_20px_5px_#0f172a] dark:hover:shadow-[0_0_20px_5px_#e2e8f0] transition-all duration-300 ease-in-out sm:w-[300px] sm:h-[300px]"
            />
          </div>

          <span className="block w-full border-t border-[0.1px] my-10 dark:border-gray-500 border-gray-200 sm:hidden"></span>

          {/* TEXT */}
          <div className="flex-1 flex justify-center items-center sm:min-h-[400px]">
            <BlurText
              text="Hi There 👋, I'am Sayid Muhammad Jundullah, Web Developer & Data Enthusiast."
              delay={200}
              animateBy="words"
              direction="bottom"
              onAnimationComplete={handleAnimationComplete}
              className="sm:text-3xl font-mono text-center text-gray-900 dark:text-gray-200 max-w-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hello;
