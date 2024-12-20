-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "category" TEXT NOT NULL DEFAULT 'No Image Available',
ADD COLUMN     "image" TEXT NOT NULL DEFAULT 'No Image Available';
