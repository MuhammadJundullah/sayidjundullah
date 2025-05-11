// import dynamic from 'next/dynamic';

import dynamic from "next/dynamic";

const About = () => {
  const ScrollReveal = dynamic(
    () => import("@/app/_components/ScrollReveal/ScrollReveal"),
    {
      ssr: false,
    }
  );

  return (
    <section id="About">
      <div className=" flex flex-col max-w-6xl mb-20 mx-auto font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <div className="text-4xl mt-10 mb-20 pb-20">
          <span className="flex items-center">
            <span className="shrink-0 pe-4 dark:text-white">
              {" "}
              <h1 className="text-6xl font-medium text-gray-400">About Me</h1>
            </span>

            <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
          </span>
          <div>
            <ScrollReveal
              baseOpacity={8}
              enableBlur={true}
              baseRotation={2}
              blurStrength={2}
              textClassName="font-thin text-4xl">
              I am a 6th-semester Informatics Engineering student with an
              interest in web development and data-related fields. I have
              experience in web development, as well as skills in dashboard
              creation and data prediction. I am open to remote freelance
              projects and ready to join a team to work while continuously
              learning together.
            </ScrollReveal>
          </div>
        </div>

        <div className="text-4xl mt-10 mv-10 mb-20 pb-20">
          <span className="flex items-center my-10">
            <span className="shrink-0 pe-4 dark:text-white">
              {" "}
              <h1 className="text-4xl font-medium text-gray-400">
                What i do ?
              </h1>
            </span>

            <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
          </span>

          <p className="leading-normal">
            I specialize in creating responsive websites and data-driven
            applications using modern technologies. From backend development
            using Laravel and PostgreSQL, to analyzing data pipelines with tools
            like Apache Airflow and Kafka — I aim to combine clean code with
            impactful functionality. As someone who grew up around the hard work
            of a coffee-farming family, I bring the same dedication and
            attention to detail into every project I work on. I love
            transforming complex data into useful insights and building web apps
            that are not just functional, but also meaningful.
          </p>
        </div>
      </div>
    </section>
  );
};

export default About;
