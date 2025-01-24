-- CreateEnum
CREATE TYPE "Status" AS ENUM ('pending', 'approved', 'rejected');

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "status" "Status" NOT NULL DEFAULT 'pending';
