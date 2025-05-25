import { useEffect, useState } from "react";
import * as React from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import Loading from "@/app/_components/Loading";

interface Certificates {
  name: string;
  desc: string;
  date: string;
  site: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificates[]>([]);

  const AnimatedContent = dynamic(
    () => import("@/app/_components/AnimatedContent/AnimatedContent"),
    {
      ssr: false,
    }
  );

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch("/api/certificates");
      const data = await res.json();
      setCertificates(data);
    };

    fetchData();
  }, []);

  return (
    <section id="certificates">
      <div className="sm:py-40 flex flex-col max-w-6xl sm:mx-auto mx-5 mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <span className="text-3xl flex items-center">
          <span className="shrink-0 pe-4 ">
            <h1 className="sm:text-5xl font-mono dark:text-white text-gray-800">
              My Certifications
            </h1>
          </span>
          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="my-20">
          <div className="flex flex-wrap justify-center gap-5">
            {certificates.length === 0 ? (
              <Loading />
            ) : (
              certificates.map((certificate, i) => (
                <div
                  key={i}
                  className="hover:scale-105 transition-all duration-300 ease-in-out">
                  <AnimatedContent
                    distance={100}
                    direction="vertical"
                    reverse={false}
                    config={{ tension: 120, friction: 14 }}
                    initialOpacity={0}
                    animateOpacity
                    threshold={0.1}>
                    <div>
                      <Image
                        src={`https://res.cloudinary.com/dislphwb0/image/upload/v1747003789/${certificate.name}`}
                        // src={`/static-image/Certificate/${certificate.name}`}
                        alt={certificate.name}
                        width={345}
                        height={140}
                        className="rounded-lg shadow-lg"
                        style={{ objectFit: "cover" }}
                      />
                      <div className="mx-auto mt-4 items-center justify-center text-center mb-7">
                        <h3 className="font-semibold dark:text-white text-gray-800">
                          {certificate.desc}
                        </h3>
                        <time className="text-gray-500 dark:text-gray-400 font-medium">
                          {certificate.date}
                        </time>
                      </div>
                    </div>
                  </AnimatedContent>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
