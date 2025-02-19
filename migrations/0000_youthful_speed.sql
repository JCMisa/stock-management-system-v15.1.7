CREATE TABLE "transactionDeleteLogs" (
	"id" serial PRIMARY KEY NOT NULL,
	"transactionId" varchar NOT NULL,
	"deleteReason" text,
	"deletedBy" varchar,
	"createdAt" varchar
);
