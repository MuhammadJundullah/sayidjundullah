// import dynamic from 'next/dynamic'


const WorkExperiences = () => {

  // const TiltedCard = dynamic(
  // () => import("@/app/_components/TiltedCard/TiltedCard"),
  //     {
  //         ssr: false,
  //     }
  // );

  return (
    <section id="About">
      <div className="h-screen flex flex-col max-w-5xl mx-auto mb-20 font-thin text-center text-[#0f172a] dark:text-[#e2e8f0]">
        <h1 className="text-4xl font-thin">My Work Experiences</h1>
        
      </div>
    </section>
  );
}

export default WorkExperiences


  