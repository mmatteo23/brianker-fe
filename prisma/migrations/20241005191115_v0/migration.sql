/*
  Warnings:

  - You are about to drop the column `userId` on the `Gym` table. All the data in the column will be lost.
  - Added the required column `gymId` to the `Challenge` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `Gym` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `TrainingSession` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gymId` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Gym" DROP CONSTRAINT "Gym_userId_fkey";

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Gym" DROP COLUMN "userId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "ownerId" TEXT;

-- AlterTable
ALTER TABLE "TrainingSession" ADD COLUMN     "gymId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "gymId" TEXT NOT NULL,
ADD COLUMN     "rank" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "Owner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Owner_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Owner_email_key" ON "Owner"("email");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Gym" ADD CONSTRAINT "Gym_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Challenge" ADD CONSTRAINT "Challenge_gymId_fkey" FOREIGN KEY ("gymId") REFERENCES "Gym"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
