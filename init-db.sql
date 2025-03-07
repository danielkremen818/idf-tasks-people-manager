
-- Initialize database schema based on prisma schema

-- Create user roles enum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'SUPERVISOR', 'USER');

-- Create task status enum
CREATE TYPE "TaskStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- Create task priority enum
CREATE TYPE "TaskPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');

-- Create Department table
CREATE TABLE "Department" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "colorCode" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  PRIMARY KEY ("id")
);

-- Create Exemption table
CREATE TABLE "Exemption" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  PRIMARY KEY ("id")
);

-- Create User table
CREATE TABLE "User" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "passwordHash" TEXT NOT NULL,
  "role" "UserRole" NOT NULL DEFAULT 'USER',
  "departmentId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  PRIMARY KEY ("id"),
  CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- Create unique constraint on User email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Create Person table
CREATE TABLE "Person" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "available" BOOLEAN NOT NULL DEFAULT true,
  "emergencyContact" TEXT NOT NULL,
  "departmentId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  PRIMARY KEY ("id"),
  CONSTRAINT "Person_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "Person_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create unique constraint on Person email and userId
CREATE UNIQUE INDEX "Person_email_key" ON "Person"("email");
CREATE UNIQUE INDEX "Person_userId_key" ON "Person"("userId");

-- Create Task table
CREATE TABLE "Task" (
  "id" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "status" "TaskStatus" NOT NULL DEFAULT 'PENDING',
  "priority" "TaskPriority" NOT NULL DEFAULT 'MEDIUM',
  "dueDate" TIMESTAMP(3) NOT NULL,
  "assignedPersonId" TEXT,
  "assignedById" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  
  PRIMARY KEY ("id"),
  CONSTRAINT "Task_assignedPersonId_fkey" FOREIGN KEY ("assignedPersonId") REFERENCES "Person"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "Task_assignedById_fkey" FOREIGN KEY ("assignedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Create join table for Person_Exemption many-to-many relationship
CREATE TABLE "_PersonExemptions" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  
  CONSTRAINT "_PersonExemptions_A_fkey" FOREIGN KEY ("A") REFERENCES "Exemption"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "_PersonExemptions_B_fkey" FOREIGN KEY ("B") REFERENCES "Person"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create join table for Task_Exemption many-to-many relationship
CREATE TABLE "_TaskProhibitedExemptions" (
  "A" TEXT NOT NULL,
  "B" TEXT NOT NULL,
  
  CONSTRAINT "_TaskProhibitedExemptions_A_fkey" FOREIGN KEY ("A") REFERENCES "Exemption"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "_TaskProhibitedExemptions_B_fkey" FOREIGN KEY ("B") REFERENCES "Task"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- Create additional indexes
CREATE UNIQUE INDEX "_PersonExemptions_AB_unique" ON "_PersonExemptions"("A", "B");
CREATE INDEX "_PersonExemptions_B_index" ON "_PersonExemptions"("B");
CREATE UNIQUE INDEX "_TaskProhibitedExemptions_AB_unique" ON "_TaskProhibitedExemptions"("A", "B");
CREATE INDEX "_TaskProhibitedExemptions_B_index" ON "_TaskProhibitedExemptions"("B");

-- Create required_skills column for Task table (Array type)
ALTER TABLE "Task" ADD COLUMN "requiredSkills" TEXT[];

-- Insert default admin user with hashed password (admin123)
INSERT INTO "User" ("id", "name", "email", "passwordHash", "role", "createdAt", "updatedAt")
VALUES ('1', 'Task Force Commander', 'commander@taskforce.com', '$2a$10$hBn5gu6cGelJNiE6DDsaBOmZgyumCSj7TeQCBgpChbVvJwE.ttuc.', 'ADMIN', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
