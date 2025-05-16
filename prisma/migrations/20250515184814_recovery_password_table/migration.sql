-- CreateTable
CREATE TABLE "passwords_recoveries" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "passwords_recoveries_pkey" PRIMARY KEY ("id")
);
