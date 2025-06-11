-- CreateTable
CREATE TABLE "PasswordRestToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordRestToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PasswordRestToken_token_key" ON "PasswordRestToken"("token");

-- CreateIndex
CREATE INDEX "PasswordRestToken_token_idx" ON "PasswordRestToken"("token");

-- AddForeignKey
ALTER TABLE "PasswordRestToken" ADD CONSTRAINT "PasswordRestToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
