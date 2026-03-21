/*
  Warnings:

  - You are about to drop the column `phone` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Problem" ADD COLUMN "algorithmType" TEXT;
ALTER TABLE "Problem" ADD COLUMN "brute_force_explanation" TEXT;
ALTER TABLE "Problem" ADD COLUMN "brute_force_steps" TEXT;
ALTER TABLE "Problem" ADD COLUMN "complexity" TEXT;
ALTER TABLE "Problem" ADD COLUMN "constraints" TEXT;
ALTER TABLE "Problem" ADD COLUMN "edgeCases" TEXT;
ALTER TABLE "Problem" ADD COLUMN "examples" TEXT;
ALTER TABLE "Problem" ADD COLUMN "optimal_explanation" TEXT;
ALTER TABLE "Problem" ADD COLUMN "optimal_steps" TEXT;
ALTER TABLE "Problem" ADD COLUMN "patternSignals" TEXT;
ALTER TABLE "Problem" ADD COLUMN "primaryPattern" TEXT;
ALTER TABLE "Problem" ADD COLUMN "problem_statement" TEXT;
ALTER TABLE "Problem" ADD COLUMN "secondaryPatterns" TEXT;
ALTER TABLE "Problem" ADD COLUMN "shortPatternReason" TEXT;
ALTER TABLE "Problem" ADD COLUMN "space_complexity" TEXT;
ALTER TABLE "Problem" ADD COLUMN "status" TEXT;
ALTER TABLE "Problem" ADD COLUMN "tags" TEXT;
ALTER TABLE "Problem" ADD COLUMN "thinking_guide" TEXT;
ALTER TABLE "Problem" ADD COLUMN "time_complexity" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "email" TEXT,
    "googleId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "username" TEXT,
    "password" TEXT
);
INSERT INTO "new_User" ("createdAt", "email", "googleId", "id", "password", "username") SELECT "createdAt", "email", "googleId", "id", "password", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_googleId_key" ON "User"("googleId");
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
