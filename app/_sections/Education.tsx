"use client";
import React from "react";
import { useState } from "react";
import Image from "next/image";
import type { EducationsType } from "@/lib/type";
import Loading from "@/app/_components/Loading";

interface EducationsProps {
  data: EducationsType[];
}

export default function Educations({ data }: EducationsProps) {
  const [educations] = useState<EducationsType[]>(data);

  return (
    <section id="Educations">
      <div className="sm:h-screen sm:py-40 flex flex-col max-w-6xl sm:mx-auto mx-5 sm:mb-40 font-thin text-gray-800">
        <span className="text-2xl flex items-center sm:mb-10">
          <span className="shrink-0 pe-4">
            <h1 className="sm:text-5xl font-mono font-semibold  text-gray-800">
              Educations
            </h1>
          </span>
          <span className="h-px flex-1 bg-gray-600 "></span>
        </span>
        <div className="my-20">
          {educations.length === 0 ? (
            <Loading />
          ) : (
            educations.map((education, index) => (
              <div key={index}>
                <ol className="sm:text-3xl relative space-y-8 before:absolute before:-ml-px before:h-full before:w-0.5 before:rounded-full before:bg-gray-200 dark:before:bg-gray-600">
                  <li className="relative -ms-1.5 flex items-start gap-4">
                    <span className="size-3 shrink-0 rounded-full bg-gray-800 "></span>

                    <div className="sm:mt-10">
                      <h3 className="font-bold mb-6 flex items-center gap-6 sm:-mt-16 -mt-5 text-gray-700">
                        <Image
                          src={`/static-image/Education/${education.name}`}
                          alt={education.name}
                          width={90}
                          height={90}
                          className="rounded-full"
                        />
                        <span>
                          {education.school} | {education.major}
                          <br />
                          <time className="font-light text-black">
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
}
