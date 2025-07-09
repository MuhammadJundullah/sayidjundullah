-- CreateTable
CREATE TABLE "Project" (
    "id" SERIAL NOT NULL,
    "judul" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "categoryslug" TEXT NOT NULL,
    "url" TEXT,
    "photo" TEXT,
    "tech" TEXT,
    "site" TEXT,
    "desc" TEXT,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Education" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Education_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Jobdesk" (
    "id" SERIAL NOT NULL,
    "experiences_id" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Jobdesk_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Jobdesk" ADD CONSTRAINT "Jobdesk_experiences_id_fkey" FOREIGN KEY ("experiences_id") REFERENCES "Experience"("id") ON DELETE CASCADE ON UPDATE CASCADE;
