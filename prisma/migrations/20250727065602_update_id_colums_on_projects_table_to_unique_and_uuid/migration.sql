/*
  Warnings:

  - A unique constraint covering the columns `[id]` on the table `Projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Projects_id_key" ON "Projects"("id");
