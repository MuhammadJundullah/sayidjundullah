/*
  Warnings:

  - The primary key for the `Projects` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Projects_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Projects_id_seq";
