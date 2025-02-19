import { sql } from "drizzle-orm";
import {
  integer,
  jsonb,
  numeric,
  pgTable,
  serial,
  text,
  varchar,
} from "drizzle-orm/pg-core";

export const User = pgTable("user", {
  id: serial("id").primaryKey(),
  userId: varchar("userId").notNull(),
  email: varchar("email").notNull(),
  firstname: varchar("firstname"),
  lastname: varchar("lastname"),
  imageUrl: varchar("imageUrl"),
  gender: varchar("gender"),
  age: integer("age"),
  dateOfBirth: varchar("dateOfBirth"),
  contact: varchar("contact"),
  address: varchar("address"),
  bio: text("bio"),
  role: varchar("role"),
  roleChangeRequest: integer("roleChangeRequest").default(5),
  createdAt: varchar("createdAt"),
});

export const Patient = pgTable("patient", {
  id: serial("id").primaryKey(),
  patientId: varchar("patientId").notNull(), //ok
  doctorId: varchar("doctorId"), // doctor who prescribed medicine to the patient - ok
  pharmacistId: varchar("pharmacistId"), // pharmacist who sold medicine to the patient
  addedBy: varchar("addedBy"), // receptionist or admin who added this patient - ok

  firstname: varchar("firstname"), //ok
  lastname: varchar("lastname"), //ok
  fullname: varchar("fullname"), //ok
  email: varchar("email"), //ok
  imageUrl: varchar("imageUrl"), //ok
  gender: varchar("gender"), //ok
  age: integer("age"), //ok
  address: varchar("address"), //ok
  contact: varchar("contact"), //ok
  occupation: varchar("occupation"), //ok
  emergencyContactName: varchar("emergencyContactName"), //ok
  emergencyContactNumber: varchar("emergencyContactNumber"), //ok
  insuranceProvider: varchar("insuranceProvider"), //ok
  insurancePolicyNumber: varchar("insurancePolicyNumber"), //ok
  identificationCardType: varchar("identificationCardType"), //ok
  identificationCardNumber: varchar("identificationCardNumber"), //ok

  conditionName: varchar("conditionName"), //ok
  conditionDescription: text("conditionDescription"), //ok
  conditionSeverity: varchar("conditionSeverity"), //ok
  allergies: varchar("allergies"), //ok
  familyMedicalHistory: varchar("familyMedicalHistory"), //ok

  prescription: text("prescription"), //ok

  createdAt: varchar("createdAt"), //ok
  updatedAt: varchar("updatedAt"), //ok
});

export const Appointment = pgTable("appointment", {
  id: serial("id").primaryKey(),
  appointmentId: varchar("appointmentId"),
  patientId: varchar("patientId"),
  doctorId: varchar("doctorId"),
  patientName: varchar("patientName"),
  doctorName: varchar("doctorName"),
  reason: varchar("reason"),
  conditionDescription: text("conditionDescription"),
  severity: varchar("severity"),
  familyMedicalHistory: varchar("familyMedicalHistory"),
  allergies: varchar("allergies"),
  status: varchar("status").default("pending"),
  date: varchar("date"),
  timeStart: varchar("timeStart"),
  timeEnd: varchar("timeEnd"),
  createdAt: varchar("createdAt"),
});

export const Supplier = pgTable("supplier", {
  id: serial("id").primaryKey(),
  supplierId: varchar("supplierId").notNull().unique(), // Unique identifier for the supplier
  supplierName: varchar("supplierName").notNull(), // Name of the supplier company
  supplierDescription: text("supplierDescription"),
  contactPerson: varchar("contactPerson"), // Name of the contact person at the supplier
  contactEmail: varchar("contactEmail"), // Email address of the contact person
  contactPhone: varchar("contactPhone"), // Phone number of the contact person
  address: varchar("address"), // Address of the supplier
  city: varchar("city"), // City of the supplier
  state: varchar("state"), // State of the supplier
  zipCode: varchar("zipCode"), // Zip code of the supplier
  country: varchar("country"), // Country of the supplier
  website: varchar("website"), // Website of the supplier (optional)
  // Add other relevant properties like payment terms, credit limit, etc. as needed.
  createdAt: varchar("createdAt"), // Timestamp of when the supplier was added
});

export const Medicine = pgTable("medicine", {
  id: serial("id").primaryKey(),
  addedBy: varchar("addedBy"), //ok
  createdAt: varchar("createdAt"), //ok

  // basic information
  medicineId: varchar("medicineId"), //ok
  name: varchar("name"), //ok
  brand: varchar("brand"), //ok
  category: varchar("category"), // antibiotic or what - ok

  // composition and dosage
  activeIngredients: text("activeIngredients").array(), //ok
  dosage: varchar("dosage"), // in ml - ok
  form: varchar("form"), // tablet | capsule | syrup - ok

  // packaging and storage
  unitsPerPackage: varchar("unitsPerPackage"), // how many units per package, ml if syrup - ok
  storageCondition: varchar("storageCondition"), // room temperature | refrigeration - ok
  expiryDate: varchar("expiryDate"), //ok
  expired: varchar("expired"), // tells if expired or not [value is either expired or not expired] - ok

  // inventory management
  stockQuantity: integer("stockQuantity"), // how many in total are there in the inventory - ok
  reorderLevel: integer("reorderLevel"), // quantity level of medicine inventory where you need to re order again - ok
  supplierId: varchar("supplierId")
    .references(() => Supplier.supplierId)
    .notNull(),
  supplierName: varchar("supplierName"), // name of supplier - ok
  batchNumber: varchar("batchNumber"), //ok
  // restock: varchar("restock"), // value is either [needed or not needed] - ok

  // financial information
  costPrice: numeric({ precision: 100, scale: 2 }), //ok
  sellingPrice: numeric({ precision: 100, scale: 2 }), //ok

  // regulatory information
  prescriptionRequired: varchar("prescriptionRequired"), //ok
  fdaApproved: varchar("fdaApproved"), //ok
  usageWarnings: text("usageWarnings"), //ok

  // addtional information
  sideEffects: text("sideEffects"), //ok
  usageInstructions: text("usageInstructions"), //ok

  // optional
  imageUrl: varchar("imageUrl"), //ok
  notes: text("notes"), //ok
});

export const Transaction = pgTable("transaction", {
  id: serial("id").primaryKey(),
  transactionId: varchar("transactionId").notNull(),
  patientId: varchar("patientId").notNull(),
  patientName: varchar("patientName"),
  sellerEmail: varchar("sellerEmail"),
  medicineData: jsonb("medicineData"),
  medicines: text("medicines")
    .array()
    .default(sql`'{}'::text[]`),
  quantities: text("quantities")
    .array()
    .default(sql`'{}'::text[]`),
  medicineNames: text("medicineNames")
    .array()
    .default(sql`'{}'::text[]`),
  totalSales: numeric("totalSales"),
  transactionDate: varchar("transactionDate"),
});

export const RoleChangeRequest = pgTable("roleChangeRequest", {
  id: serial("id").primaryKey(),
  roleChangeRequestId: varchar("roleChangeRequestId").notNull(),
  requestOwner: varchar("requestOwner").notNull(),
  currentRole: varchar("currentRole"),
  requestedRole: varchar("requestedRole"),
  reason: text("reason"),
  imageProof: varchar("imageProof"),
  fileExtension: varchar("fileExtension"),
  status: varchar("status").default("pending"), // pending | approved | rejected
  createdAt: varchar("createdAt"),
});

// export const TransactionDeleteLogs = pgTable("transactionDeleteLogs", {
//   id: serial("id").primaryKey(),
//   transactionId: varchar("transactionId").notNull(),
//   deleteReason: text("deleteReason"),
//   deletedBy: varchar("deletedBy"),
//   createdAt: varchar("createdAt"),
// });
