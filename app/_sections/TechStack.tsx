"use client";

import Image from "next/image";
import { motion } from "framer-motion"; // Untuk animasi logo

// Data logo statis
const staticLogos = [
  { id: "1", name: "React", logoUrl: "/static-image/TechStack/reactjs.webp" },
  { id: "2", name: "Next.js", logoUrl: "/static-image/TechStack/nextjs.png" },
  { id: "3", name: "Node.js", logoUrl: "/static-image/TechStack/nodejs.png" },
  {
    id: "4",
    name: "TypeScript",
    logoUrl: "/static-image/TechStack/typescript.png",
  },
  {
    id: "5",
    name: "Tailwind CSS",
    logoUrl: "/static-image/TechStack/tailwind.png",
  },
  { id: "6", name: "Prisma", logoUrl: "/static-image/TechStack/prisma.png" },
  {
    id: "7",
    name: "PostgreSQL",
    logoUrl: "/static-image/TechStack/postgre.png",
  },
  {
    id: "8",
    name: "Github",
    logoUrl: "/static-image/TechStack/logogithub.png",
  },
  { id: "9", name: "Laravel", logoUrl: "/static-image/TechStack/laravel.png" },
  { id: "10", name: "Docker", logoUrl: "/static-image/TechStack/docker.webp" },
  { id: "11", name: "MySQL", logoUrl: "/static-image/TechStack/mysql.png" },
  {
    id: "12",
    name: "Nest.js",
    logoUrl: "/static-image/TechStack/nestjs.png",
  },
  // Tambahkan lebih banyak logo sesuai kebutuhan Anda
];

const TechStack = () => {
  // Tidak perlu state untuk loading/error/data dari API lagi
  // const [logos, setLogos] = useState<TechLogo[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  // Tidak perlu useEffect untuk fetching data lagi
  // useEffect(() => { ... }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1, // Animasi setiap logo secara berurutan
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section id="about" className="py-16 sm:py-24">
      <div className="flex flex-col max-w-6xl mb-20 mx-auto px-5">
        <div className="text-center sm:text-left mb-16">
          <div className="flex items-center my-10">
            <span className="flex-1 h-px bg-gray-300 sm:hidden"></span>{" "}
            {/* Garis hanya di mobile */}
            <h1 className="text-4xl sm:text-6xl font-mono font-light text-black px-4">
              TechStack
            </h1>
            <span className="flex-1 h-px bg-gray-300"></span>
          </div>

          <div className="shadow-lg p-5 sm:p-10 rounded-3xl border border-gray-200 bg-white">
            {/* Langsung render logo dari staticLogos */}
            <motion.div
              className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6 sm:gap-8 justify-items-center"
              variants={containerVariants}
              initial="hidden"
              animate="visible">
              {staticLogos.map((logo) => (
                <motion.div
                  key={logo.id}
                  className="flex flex-col items-center p-3 sm:p-4 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 transform hover:scale-105 group"
                  variants={itemVariants}>
                  <Image
                    src={logo.logoUrl}
                    alt={logo.name}
                    width={64} // Ukuran logo default
                    height={64}
                    className="object-contain mb-2 sm:mb-3 group-hover:brightness-110"
                  />
                  <p className="text-sm sm:text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                    {logo.name}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStack;
