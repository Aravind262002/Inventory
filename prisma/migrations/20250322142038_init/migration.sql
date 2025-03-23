-- CreateTable
CREATE TABLE "Product" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "timeSlotType" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "PaxType" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceFinal" REAL NOT NULL,
    "priceOriginal" REAL NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "min" INTEGER,
    "max" INTEGER,
    CONSTRAINT "PaxType_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Slot" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "productId" INTEGER NOT NULL,
    "startDate" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "priceFinal" REAL NOT NULL,
    "priceOriginal" REAL NOT NULL,
    "currencyCode" TEXT NOT NULL,
    "remaining" INTEGER NOT NULL,
    CONSTRAINT "Slot_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SlotPaxAvailability" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "slotId" INTEGER NOT NULL,
    "paxTypeId" INTEGER NOT NULL,
    "remaining" INTEGER NOT NULL,
    CONSTRAINT "SlotPaxAvailability_slotId_fkey" FOREIGN KEY ("slotId") REFERENCES "Slot" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SlotPaxAvailability_paxTypeId_fkey" FOREIGN KEY ("paxTypeId") REFERENCES "PaxType" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "PaxType_productId_type_key" ON "PaxType"("productId", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Slot_productId_startDate_startTime_key" ON "Slot"("productId", "startDate", "startTime");

-- CreateIndex
CREATE UNIQUE INDEX "SlotPaxAvailability_slotId_paxTypeId_key" ON "SlotPaxAvailability"("slotId", "paxTypeId");
