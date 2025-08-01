/*
  Warnings:

  - Added the required column `zigTotal` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "zigPrice" DOUBLE PRECISION NOT NULL DEFAULT 0,
ALTER COLUMN "price" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "zigTotal" DOUBLE PRECISION NOT NULL;
