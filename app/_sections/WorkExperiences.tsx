import { useEffect, useState } from "react";

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

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/work-experiences");
      const data = await res.json();
      setExperiences(data);
    };

    fetchData();
  }, []);

  return (
    <section id="WorkExperiences">
      <div className="flex flex-col max-w-5xl mx-auto mb-20 text-[#0f172a] dark:text-[#e2e8f0]">
        <span className="flex items-center">
          <span className="shrink-0 pe-4 text-gray-900 dark:text-white">
            {" "}
            <h1 className="text-4xl font-bold">My Work Experiences</h1>
          </span>

          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="my-20">
          {experiences.map((exp, i) => (
            <div key={i}>
              <ol className="text-3xl relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200">
                <li className="relative -ms-1.5 flex items-start gap-4">
                  <span className="size-3 shrink-0 rounded-full bg-white"></span>

                  <div className="-mt-2">
                    <h3 className="font-bold mb-3">
                      {exp.position} at {exp.company_name}
                    </h3>

                    <time className="font-medium mt-3">
                      {exp.duration} | {exp.type}
                    </time>

                    <ul className="list-disc list-inside text-start font-thin mb-16 mt-5">
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
          ))}
        </div>
      </div>
    </section>
  );
};

export default WorkExperiences;

