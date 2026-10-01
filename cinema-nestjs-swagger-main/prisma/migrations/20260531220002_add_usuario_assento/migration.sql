-- CreateTable
CREATE TABLE "Usuario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "criadoEm" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingresso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessaoId" INTEGER NOT NULL,
    "pedidoId" INTEGER,
    "tipo" TEXT NOT NULL,
    "valorPago" REAL NOT NULL,
    "assento" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Ingresso_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ingresso_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ingresso" ("id", "pedidoId", "sessaoId", "tipo", "valorPago") SELECT "id", "pedidoId", "sessaoId", "tipo", "valorPago" FROM "Ingresso";
DROP TABLE "Ingresso";
ALTER TABLE "new_Ingresso" RENAME TO "Ingresso";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");
