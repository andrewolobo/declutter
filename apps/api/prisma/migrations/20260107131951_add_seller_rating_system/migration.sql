-- AlterTable
ALTER TABLE "users" ADD COLUMN     "positive_ratings" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "seller_rating" DECIMAL(3,2) DEFAULT 0,
ADD COLUMN     "total_ratings" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "seller_ratings" (
    "rating_id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "rater_id" INTEGER NOT NULL,
    "post_id" INTEGER,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ NOT NULL,

    CONSTRAINT "seller_ratings_pkey" PRIMARY KEY ("rating_id")
);

-- CreateIndex
CREATE INDEX "ix_seller_ratings_seller_id" ON "seller_ratings"("seller_id");

-- CreateIndex
CREATE INDEX "ix_seller_ratings_rater_id" ON "seller_ratings"("rater_id");

-- CreateIndex
CREATE INDEX "ix_seller_ratings_post_id" ON "seller_ratings"("post_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_seller_ratings_seller_rater_post" ON "seller_ratings"("seller_id", "rater_id", "post_id");

-- AddForeignKey
ALTER TABLE "seller_ratings" ADD CONSTRAINT "seller_ratings_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seller_ratings" ADD CONSTRAINT "seller_ratings_rater_id_fkey" FOREIGN KEY ("rater_id") REFERENCES "users"("user_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seller_ratings" ADD CONSTRAINT "seller_ratings_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
