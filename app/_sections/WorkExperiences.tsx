import { useEffect, useState } from "react";
import Loading from "@/app/_components/Loading";

interface Jobdesk {
  description: string;
}

interface WorkExperience {
  experience_id: string;
  company_name: string;
  position: string;
  duration: string;
  type: string;
  jobdesks: Jobdesk[];
}

const WorkExperiences = () => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await fetch("/api/work-experiences");
      const data = await res.json();
      setExperiences(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  return (
    <section id="WorkExperiences">
      <div className="flex flex-col max-w-6xl sm:mx-auto mx-5 sm:mb-20 text-gray-800 dark:text-gray-200">
        <span className="text-3xl flex items-center">
          <span className="shrink-0 pe-4">
            <h1 className="sm:text-6xl font-medium dark:text-white text-gray-800 my-10">
              My Work Experiences
            </h1>
          </span>
          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="sm:my-20 mx-2">
          {loading ? (
            <Loading />
          ) : (
            experiences.map((exp, i) => (
              <div key={i}>
                <ol className="sm:text-3xl text-xl relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200 dark:before:bg-gray-600">
                  <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full dark:bg-white bg-gray-800"></span>

                    <div className="-mt-2">
                      <h3 className="font-bold mb-3 text-gray-800 dark:text-gray-200">
                        {exp.position} at {exp.company_name}
                      </h3>

                      <time className="font-medium mt-3 text-gray-600 dark:text-gray-400">
                        {exp.duration} | {exp.type}
                      </time>

                      <ul className="list-disc list-inside text-start font-thin mb-16 mt-5 text-gray-700 dark:text-gray-300">
                        {exp.jobdesks.map((job, idx) => (
                          <li key={idx}>
                            <p>{job.description}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                </ol>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default WorkExperiences;
