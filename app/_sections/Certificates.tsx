import { useEffect, useState } from "react";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
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
    <section id="Projects">
      <div className="py-40 flex flex-col max-w-6xl mx-auto mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <span className="flex items-center">
          <span className="shrink-0 pe-4 dark:text-white">
            {" "}
            <h1 className="text-6xl font-medium text-gray-400">
              My Certifications
            </h1>
          </span>

          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="my-20">
          <div className="flex flex-wrap justify-center gap-8">
            {certificates.length === 0 ? (
              <Loading />
            ) : (
              certificates.map((certificate, i) => (
                <div key={i}>
                  <AnimatedContent
                    distance={100}
                    direction="vertical"
                    reverse={false}
                    config={{ tension: 120, friction: 14 }}
                    initialOpacity={0}
                    animateOpacity
                    threshold={0.1}>
                    <div>
                      <Card sx={{ maxWidth: 345 }}>
                        <CardMedia>
                          <Image
                            src={`/static-image/Certificate/${certificate.name}`}
                            alt={certificate.name}
                            width={345}
                            height={140}
                            style={{ objectFit: "cover" }}
                          />
                        </CardMedia>
                        <CardContent>
                          <Typography
                            gutterBottom
                            component="div"
                            className="text-2xl">
                            {certificate.desc}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{ color: "text.secondary" }}>
                            {certificate.date}
                          </Typography>
                        </CardContent>
                      </Card>
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
