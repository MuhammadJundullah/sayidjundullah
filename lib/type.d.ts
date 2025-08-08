declare global {
  namespace NodeJS {
    interface Global {
      prisma: any;
    }
  }
}

export type UserType = {
  id: number;
  username: string;
  password: string;
};

export type JobdeskType = {
  description: string;
};

export type WorkExperienceType = {
  experience_id: string;
  company_name: string;
  position: string;
  duration: string;
  type: string;
  jobdesks: JobdeskType[];
};

export type ProjectsType = {
  id: string;
  judul: string;
  slug: string;
  category: string;
  categoryslug: string;
  url: string;
  photo: string | null;
  tech: string;
  site: string;
  desc: string;
};

export type ApiResponse = ProjectsType[] | { message: string } | null;

export type CertificatesType = {
  id: string;
  name: string;
  desc: string;
  photo: string;
  status: "published" | "archived";
  date: string;
  site: string;
  created_at: string;
  updated_at: string;
};

export type EducationsType = {
  name: string;
  school: string;
  major: string;
  date: string;
};

export type TechStackType = {
  id: string;
  name: string;
  image: string;
  description: string;
};
