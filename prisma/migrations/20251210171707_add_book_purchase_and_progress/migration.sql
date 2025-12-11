-- CreateTable
CREATE TABLE "BookPurchase" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "bookId" STRING NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookUserProgress" (
    "id" STRING NOT NULL,
    "userId" STRING NOT NULL,
    "bookChapterId" STRING NOT NULL,
    "isCompleted" BOOL NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BookUserProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BookPurchase_bookId_idx" ON "BookPurchase"("bookId");

-- CreateIndex
CREATE UNIQUE INDEX "BookPurchase_userId_bookId_key" ON "BookPurchase"("userId", "bookId");

-- CreateIndex
CREATE INDEX "BookUserProgress_bookChapterId_idx" ON "BookUserProgress"("bookChapterId");

-- CreateIndex
CREATE UNIQUE INDEX "BookUserProgress_userId_bookChapterId_key" ON "BookUserProgress"("userId", "bookChapterId");

-- AddForeignKey
ALTER TABLE "BookPurchase" ADD CONSTRAINT "BookPurchase_bookId_fkey" FOREIGN KEY ("bookId") REFERENCES "Book"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookUserProgress" ADD CONSTRAINT "BookUserProgress_bookChapterId_fkey" FOREIGN KEY ("bookChapterId") REFERENCES "BookChapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
