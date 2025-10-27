-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "TeamRole" AS ENUM ('Leader', 'Member');

-- CreateEnum
CREATE TYPE "Education" AS ENUM ('SMA', 'SMK', 'D3', 'S1');

-- CreateEnum
CREATE TYPE "CompetitionName" AS ENUM ('PDC', 'IPPC', 'BCC', 'STEM');

-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('Male', 'Female');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "birthDate" TEXT,
ADD COLUMN     "domicile" TEXT,
ADD COLUMN     "education" "Education",
ADD COLUMN     "followIg" TEXT,
ADD COLUMN     "gender" "Gender",
ADD COLUMN     "imageKey" TEXT,
ADD COLUMN     "institution" TEXT,
ADD COLUMN     "ktm" TEXT,
ADD COLUMN     "major" TEXT,
ADD COLUMN     "pDDikti" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "semester" INTEGER,
ADD COLUMN     "twibbon" TEXT;

-- CreateTable
CREATE TABLE "CompRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamName" TEXT,
    "teamId" TEXT,
    "paymentId" TEXT NOT NULL,
    "statusOrder" TEXT DEFAULT 'pending',
    "competitionName" "CompetitionName" NOT NULL,
    "name" TEXT,
    "gender" "Gender",
    "email" TEXT,
    "phoneNumber" TEXT,
    "education" "Education",
    "school" TEXT,
    "mentor" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventRegistration" (
    "id" TEXT NOT NULL,
    "event_name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EventRegistration_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Team" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "competition" "CompetitionName",
    "paymentId" TEXT,
    "status" TEXT DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Team_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMember" (
    "userId" TEXT NOT NULL,
    "teamId" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "role" "TeamRole",
    "joinDate" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamMember_pkey" PRIMARY KEY ("userId","teamId")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "userId" TEXT,
    "status" TEXT DEFAULT 'pending',
    "competition" TEXT,
    "amount" INTEGER NOT NULL,
    "redirectUrl" TEXT,
    "snapToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CompRegistration_teamId_key" ON "CompRegistration"("teamId");

-- CreateIndex
CREATE UNIQUE INDEX "CompRegistration_paymentId_key" ON "CompRegistration"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_paymentId_key" ON "Team"("paymentId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_orderId_key" ON "Payment"("orderId");

-- AddForeignKey
ALTER TABLE "CompRegistration" ADD CONSTRAINT "CompRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompRegistration" ADD CONSTRAINT "CompRegistration_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompRegistration" ADD CONSTRAINT "CompRegistration_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventRegistration" ADD CONSTRAINT "EventRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("orderId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMember" ADD CONSTRAINT "TeamMember_teamId_fkey" FOREIGN KEY ("teamId") REFERENCES "Team"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
