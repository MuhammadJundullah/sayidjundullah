import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

interface Certificates {
  name: string;
  desc: string;
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
      <div className="flex flex-col max-w-5xl mx-auto mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <h1 className="text-4xl font-bold">My Certifications</h1>
        <div className="my-20">
          <div className="flex flex-wrap justify-center gap-8">
            {certificates.map((certificate, i) => (
              <div key={i}>
                <TiltedCard
                  imageSrc={"/static-image/certificate/" + certificate.name}
                  altText={certificate.name}
                  captionText={certificate.desc}
                  containerHeight="200px"
                  containerWidth="300px"
                  imageHeight="200px"
                  imageWidth="300px"
                  rotateAmplitude={12}
                  scaleOnHover={1.2}
                  showMobileWarning={false}
                  overlayContent={
                    <p className="tilted-card-demo-text text-black">
                      {certificate.desc}
                    </p>
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
