import { useEffect, useState } from "react";
import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import Link from "next/link";

interface Certificates {
  name: string;
  desc: string;
  date: string;
  site: string;
}

const Certificates = () => {
  const [certificates, setCertificates] = useState<Certificates[]>([]);

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
          <span className="shrink-0 pe-4 text-gray-900 dark:text-white">
            {" "}
            <h1 className="text-4xl font-bold">My Certifications</h1>
          </span>

          <span className="h-px flex-1 bg-gray-300 dark:bg-gray-600"></span>
        </span>
        <div className="my-20">
          <div className="flex flex-wrap justify-center gap-y-16 gap-x-8">
            {certificates.map((certificate, i) => (
              <div key={i}>
                <Link
                  href={`${certificate.site}`}
                  target="_blank"
                  rel="noopener noreferrer">
                  <Card sx={{ maxWidth: 345 }}>
                    <CardMedia>
                      <Image
                        src={`/static-image/certificate/${certificate.name}`}
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
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
