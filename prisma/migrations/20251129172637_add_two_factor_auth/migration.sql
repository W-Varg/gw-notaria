-- AlterTable
ALTER TABLE "auth_usuarios" ADD COLUMN "twoFactorSecret" VARCHAR(255),
ADD COLUMN "twoFactorEnabled" BOOLEAN NOT NULL DEFAULT false;
