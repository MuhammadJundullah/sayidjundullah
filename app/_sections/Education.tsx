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
      <div className="h-screen py-40 flex flex-col max-w-6xl mx-auto mb-20 font-thin  text-[#0f172a] dark:text-[#e2e8f0]">
        <span className="flex items-center mb-10">
          <span className="shrink-0 pe-4 dark:text-white">
            {" "}
            <h1 className="text-6xl font-medium text-gray-400">Educations</h1>
          </span>
          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="my-20">
          {educations.length === 0 ? (
            <Loading />
          ) : (
            educations.map((education, index) => (
              <div key={index}>
                <ol className="text-3xl relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200">
                  <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-white"></span>

                    <div className="mt-2">
                      <h3 className="font-bold mb-6 flex items-center gap-5 -mt-12">
                        <Image
                          src={`/static-image/Education/${education.name}`}
                          alt={education.name}
                          width={100}
                          height={100}
                          className="rounded-full"
                        />
                        <span>
                          {education.school} | {education.major}
                          <br />
                          <time className="font-light">{education.date}</time>
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

