-- CreateTable
CREATE TABLE "About" (
    "id" SERIAL NOT NULL,
    "about" TEXT NOT NULL,
    "what_i_do" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "About_pkey" PRIMARY KEY ("id")
);
