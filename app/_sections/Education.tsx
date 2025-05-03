import React from 'react'
import dynamic from "next/dynamic";

const Education = () => {
  const TextPressure = dynamic(
    () => import("@/app/_components/TextPressure/TextPressure"),
    {
      ssr: false,
    }
  );

  return (
    <div className="h-screen">
      <div style={{ position: "relative" }}>
        <TextPressure
          text="Thank u!"
          alpha={false}
          stroke={false}
          width={true}
          weight={true}
          italic={true}
          textColor="#ffffff"
          strokeColor="#ff0000"
          minFontSize={10}
        />
      </div>
    </div>
  );
};

export default Education;

