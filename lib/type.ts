export type JobdeskType = {
  description: string;
}

export type WorkExperienceType = {
  experience_id: string;
  company_name: string;
  position: string;
  duration: string;
  type: string;
  jobdesks: JobdeskType[];
}

export type ProjectsType = {
  id: string;
  judul: string;
  slug: string;
  category: string;
  categoryslug: string;
  url: string;
  photo: string;
  tech: string;
  site: string;
  desc: string;
};

export type CertificatesType = {
  name: string;
  desc: string;
  date: string;
  site: string;
}


export type EducationsType = {
  name: string;
  school: string;
  major: string;
  date: string;
};
