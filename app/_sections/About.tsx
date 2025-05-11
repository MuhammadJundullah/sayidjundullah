import dynamic from "next/dynamic";
import Link from "next/link";

const About = () => {
  const ScrollReveal = dynamic(
    () => import("@/app/_components/ScrollReveal/ScrollReveal"),
    {
      ssr: false,
    }
  );

  return (
    <section id="About">
      <div className="flex flex-col max-w-6xl mb-20 sm:mx-auto mx-5 font-thin sm:text-center text-gray-800 dark:text-gray-200">
        <div className="text-3xl mt-10 mb-20 pb-20">
          <span className="flex items-center sm:my-10">
            <span className="shrink-0 pe-4">
              <h1 className="sm:text-6xl font-medium text-gray-600 dark:text-gray-300 sm:mx-0">
                About Me
              </h1>
            </span>
            <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
          </span>
          <div className="sm:mx-0">
            <ScrollReveal
              baseOpacity={8}
              enableBlur={true}
              baseRotation={2}
              blurStrength={2}
              textClassName="font-thin sm:text-4xl text-xl text-gray-700 dark:text-gray-300">
              I’m a curious and self-driven learner who loves solving problems
              with technology. As an introvert and deep thinker, I enjoy working
              behind the scenes—coding, analyzing data, and turning ideas into
              real digital solutions. I’m the type of person who learns fast,
              asks the right questions, and keeps improving with every project I
              take on. I thrive in flexible environments where I can focus,
              grow, and collaborate remotely. Whether it&apos;s building
              websites, creating data dashboards, or predicting trends from raw
              data—I&apos;m all in. My goal is simple: to keep learning, stay
              useful, and build things that matter.
            </ScrollReveal>
          </div>
        </div>

        <div className="sm:text-4xl sm:my-20 pb-20 text-xl">
          <span className="flex items-center my-5 max-w-xl mx-auto">
            <span className="shrink-0 pe-4">
              <h1 className="sm:text-4xl text-2xl font-medium text-gray-600 dark:text-gray-300">
                What I do
              </h1>
            </span>
            <span className="text-xl h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
          </span>

          <p className="leading-normal text-gray-700 dark:text-gray-300">
            I specialize in creating responsive websites and data-driven
            applications using modern technologies. From backend development
            using Laravel and PostgreSQL, to analyzing data pipelines with tools
            like Apache Airflow and Kafka — I aim to combine clean code with
            impactful functionality. As someone who grew up around the hard work
            of a coffee-farming family, I bring the same dedication and
            attention to detail into every project I work on. I love
            transforming complex data into useful insights and building web apps
            that are not just functional, but also meaningful. <br />
            <br />
            <Link
              href="mailto:sayidmuhammad15@gmail.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              Feel free to reach out via email
            </Link>{" "}
            or{" "}
            <Link
              href="https://api.whatsapp.com/send/?phone=%2B6283853291755&text&type=phone_number&app_absent=0"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-900 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 transition-colors">
              WhatsApp
            </Link>
            . Let’s connect and create something great together!
          </p>

          <div></div>
        </div>
      </div>
    </section>
  );
};

export default About;
