import dynamic from 'next/dynamic'


const Projects = () => {

  const TiltedCard = dynamic(
  () => import("@/app/_components/TiltedCard/TiltedCard"),
      {
          ssr: false,
      }
  );

  return (
    <section id="About">
      <div className="h-screen flex flex-col max-w-5xl mx-auto mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <h1 className="text-4xl font-thin">My Projects</h1>
        <TiltedCard
          imageSrc="https://i.scdn.co/image/ab67616d0000b273d9985092cd88bffd97653b58"
          altText="Kendrick Lamar - GNX Album Cover"
          captionText="Kendrick Lamar - GNX"
          containerHeight="300px"
          containerWidth="300px"
          imageHeight="300px"
          imageWidth="300px"
          rotateAmplitude={12}
          scaleOnHover={1.2}
          showMobileWarning={false}
          showTooltip={true}
          displayOverlayContent={true}
          overlayContent={
            <p className="tilted-card-demo-text">Kendrick Lamar - GNX</p>
          }
        />
      </div>
    </section>
  );
}

export default Projects;


  