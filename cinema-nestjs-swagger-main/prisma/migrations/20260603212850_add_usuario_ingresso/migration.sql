-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Ingresso" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "sessaoId" INTEGER NOT NULL,
    "pedidoId" INTEGER,
    "usuarioId" INTEGER,
    "tipo" TEXT NOT NULL,
    "valorPago" REAL NOT NULL,
    "assento" TEXT NOT NULL DEFAULT '',
    CONSTRAINT "Ingresso_sessaoId_fkey" FOREIGN KEY ("sessaoId") REFERENCES "Sessao" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Ingresso_pedidoId_fkey" FOREIGN KEY ("pedidoId") REFERENCES "Pedido" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Ingresso_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Ingresso" ("assento", "id", "pedidoId", "sessaoId", "tipo", "valorPago") SELECT "assento", "id", "pedidoId", "sessaoId", "tipo", "valorPago" FROM "Ingresso";
DROP TABLE "Ingresso";
ALTER TABLE "new_Ingresso" RENAME TO "Ingresso";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
