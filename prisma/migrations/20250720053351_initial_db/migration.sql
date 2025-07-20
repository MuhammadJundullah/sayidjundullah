-- CreateTable
CREATE TABLE "Projects" (
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
    "status" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificates" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "desc" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "site" TEXT NOT NULL,
    "photo" TEXT,
    "status" TEXT,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Certificates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Educations" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "Educations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Experiences" (
    "id" SERIAL NOT NULL,
    "company_name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Experiences_pkey" PRIMARY KEY ("id")
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

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStack" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechStack_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Projects_slug_key" ON "Projects"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Users_username_key" ON "Users"("username");

-- AddForeignKey
ALTER TABLE "Jobdesk" ADD CONSTRAINT "Jobdesk_experiences_id_fkey" FOREIGN KEY ("experiences_id") REFERENCES "Experiences"("id") ON DELETE CASCADE ON UPDATE CASCADE;
