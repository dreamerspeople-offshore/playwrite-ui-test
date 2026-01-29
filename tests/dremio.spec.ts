import { test, expect } from "@playwright/test";
import { DremioClient } from "../db/dremioClient";

test("Mongo data via Dremio", async () => {
  const dremio = new DremioClient();

  const rows = await dremio.runSQL(`
    SELECT COUNT(*) AS total
    FROM ecommercedb.ecommercedb.products
  `);

  console.log(rows);

  expect(rows[0].total).toBeGreaterThan(0);
});
