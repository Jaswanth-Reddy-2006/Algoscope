/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN "password" TEXT;
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- CreateTable
CREATE TABLE "UserProgress" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "drillScore" REAL NOT NULL DEFAULT 0,
    "visualizerScore" REAL NOT NULL DEFAULT 0,
    "templateScore" REAL NOT NULL DEFAULT 0,
    "recognitionScore" REAL NOT NULL DEFAULT 0,
    "edgeCaseScore" REAL NOT NULL DEFAULT 0,
    "confidence" REAL NOT NULL DEFAULT 0,
    "lastPracticed" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "subPatternConfidence" TEXT,
    CONSTRAINT "UserProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserProgress_userId_moduleId_key" ON "UserProgress"("userId", "moduleId");

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
