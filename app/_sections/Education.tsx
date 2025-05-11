import React from 'react'
import { useEffect, useState } from "react";
import Image from "next/image";
import Loading from "@/app/_components/Loading";

interface Educations {
  name: string;
  school: string;
  major: string;
  date: string;
}

const Education = () => {
  const [educations, setEducations] = useState<Educations[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/educations");
      const data = await res.json();
      setEducations(data);
    };

    fetchData();
  }, []);

  return (
    <section id="Educations">
      <div className="sm:h-screen sm:py-40 flex flex-col max-w-6xl sm:mx-auto mx-5 sm:mb-20 font-thin text-gray-800 dark:text-gray-200">
        <span className="text-4xl flex items-center sm:mb-10">
          <span className="shrink-0 pe-4 dark:text-white">
            <h1 className="sm:text-6xl font-medium dark:text-white text-gray-800">
              Educations
            </h1>
          </span>
          <span className="h-px flex-1 bg-gray-600 dark:bg-white"></span>
        </span>
        <div className="my-20">
          {educations.length === 0 ? (
            <Loading />
          ) : (
            educations.map((education, index) => (
              <div key={index}>
                <ol className="sm:text-3xl relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200 dark:before:bg-gray-600">
                  <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-gray-800 dark:bg-white"></span>

                    <div className="sm:mt-10">
                      <h3 className="font-bold mb-6 flex items-center gap-6 sm:-mt-16 -mt-5 text-gray-700 dark:text-gray-300">
                        <Image
                          src={`/static-image/Education/${education.name}`}
                          alt={education.name}
                          width={70}
                          height={70}
                          className="rounded-full"
                        />
                        <span>
                          {education.school} | {education.major}
                          <br />
                          <time className="font-light text-gray-500 dark:text-gray-400">
                            {education.date}
                          </time>
                        </span>
                      </h3>
                      <div className="pb-20"></div>
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

export default Education;
