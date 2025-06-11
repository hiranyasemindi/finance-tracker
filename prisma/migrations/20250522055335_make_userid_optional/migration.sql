/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "userId" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
