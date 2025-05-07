import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface Certificates {
  name: string;
  desc: string;
  date: string;
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

  const TiltedCard = dynamic(
    () => import("@/app/_components/TiltedCard/TiltedCard"),
    {
      ssr: false,
    }
  );

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
                <TiltedCard
                  imageSrc={`/static-image/certificate/${certificate.name}`}
                  altText={certificate.name}
                  captionText={certificate.desc}
                  containerHeight="200px"
                  containerWidth="350px"
                  imageHeight="200px"
                  imageWidth="350px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  // displayOverlayContent={true}
                  overlayContent={
                    <div>
                      <p className="tilted-card-demo-text text-black font-medium">
                        {certificate.desc}
                      </p>
                      <p className="tilted-card-demo-text text-black italic font-light">
                        {certificate.date}
                      </p>
                    </div>
                  }
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certificates;
