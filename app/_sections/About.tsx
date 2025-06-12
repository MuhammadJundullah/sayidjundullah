"use client";

import Link from "next/link";

const About = () => {
  return (
    <section id="about">
      <div className="flex flex-col max-w-6xl mb-20 sm:mx-auto mx-5 font-thin sm:text-center text-gray-800 dark:text-gray-200">
        <div className="text-3xl mt-10 mb-20 pb-20">
          <span className="flex items-center sm:my-10 my-5">
            <span className="shrink-0 pe-4">
              <h1 className="sm:text-6xl text-3xl font-mono font-semibold text-black dark:text-gray-300 sm:mx-0">
                About Me
              </h1>
            </span>
            <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
          </span>
          <div className="sm:mx-0 shadow-lg p-10 rounded-3xl border-1">
            <p className="leading-normal sm:text-3xl text-lg text-black dark:text-gray-300 sm:font-light font-normal">
              I’m a 6th-semester Computer Science student who thrives in
              self-directed learning. While I’ve chosen not to join campus
              organizations, I dedicate my time to mastering backend and
              frontend web development—building a strong technical foundation
              for the future. Curiosity drives me. I love dissecting how things
              work, experimenting with new tools, and turning theoretical
              knowledge into practical solutions. Remote-friendly environments
              suit me best: they let me focus deeply, learn at my own pace, and
              collaborate effectively despite distance. Based in Aceh, I’m eager
              to contribute professionally—whether it’s developing web
              applications, crafting data dashboards, or solving technical
              problems. For now, I’m keeping it simple: learn relentlessly,
              build meaningfully, and prepare for bigger challenges ahead.
            </p>
            <div className="sm:my-20 text-xl">
              <span className="flex items-center my-5 max-w-xl mx-auto">
                <span className="shrink-0 pe-4">
                  <h1 className="sm:text-5xl text-2xl font-mono font-semibold dark:text-gray-30 text-black rounded-xl px-7 py-2">
                    What i do
                  </h1>
                </span>
                <span className="text-xl h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
              </span>
              <p className="leading-normal text-black dark:text-gray-300 sm:text-3xl text-lg sm:font-light font-normal hover:cursor-pointer ">
                I specialize in building responsive websites using modern
                technologies like React.js, Next.js, and Laravel, with
                experience spanning from backend development to data pipeline
                analysis using tools like Apache Airflow and Kafka. I strive to
                write clean, maintainable code while delivering impactful
                functionality. Currently, I&apos;m diving deeper into Nest.js
                for a university-related project, expanding my backend
                expertise. Previously, I focused on Laravel for web application
                development. Beyond web dev, I&apos;m passionate about data
                analysis—particularly creating predictive models, as I&apos;ve
                done in past learning projects—and I&apos;m exploring data
                engineering as a self-proclaimed data enthusiast. I&apos;m also
                wrapping up my internship at Winnicode, where I&apos;ve gained
                hands-on experience in real-world development workflows. <br />
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
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
