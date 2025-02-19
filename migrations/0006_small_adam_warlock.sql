CREATE TABLE "supplier" (
	"id" serial PRIMARY KEY NOT NULL,
	"supplierId" varchar NOT NULL,
	"supplierName" varchar NOT NULL,
	"supplierDescription" text,
	"contactPerson" varchar,
	"contactEmail" varchar,
	"contactPhone" varchar,
	"address" varchar,
	"city" varchar,
	"state" varchar,
	"zipCode" varchar,
	"country" varchar,
	"website" varchar,
	"createdAt" varchar,
	CONSTRAINT "supplier_supplierId_unique" UNIQUE("supplierId")
);
--> statement-breakpoint
ALTER TABLE "medicine" RENAME COLUMN "supplier" TO "supplierId";--> statement-breakpoint
ALTER TABLE "medicine" ADD COLUMN "supplierName" varchar;--> statement-breakpoint
ALTER TABLE "medicine" ADD CONSTRAINT "medicine_supplierId_supplier_supplierId_fk" FOREIGN KEY ("supplierId") REFERENCES "public"."supplier"("supplierId") ON DELETE no action ON UPDATE no action;