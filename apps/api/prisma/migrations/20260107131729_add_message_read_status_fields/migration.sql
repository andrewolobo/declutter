-- AlterTable
ALTER TABLE "messages" ADD COLUMN     "is_read_by_recipient" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "is_read_by_sender" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "recipient_read_at" TIMESTAMPTZ,
ADD COLUMN     "sender_read_at" TIMESTAMPTZ;
