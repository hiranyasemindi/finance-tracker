/*
  Warnings:

  - You are about to drop the column `Date` on the `Transactions` table. All the data in the column will be lost.
  - You are about to drop the column `note` on the `Transactions` table. All the data in the column will be lost.
  - Added the required column `date` to the `Transactions` table without a default value. This is not possible if the table is not empty.
  - Added the required column `notes` to the `Transactions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Transactions" DROP COLUMN "Date",
DROP COLUMN "note",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "notes" TEXT NOT NULL;
