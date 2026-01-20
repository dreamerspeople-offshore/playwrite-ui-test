import { test, expect } from "@playwright/test";
import { getAllProducts, getProducts } from "../db/mongodb";
import { ProductsPage } from "../pages/products.page";
import { normalize } from "../utils/compare";

test("Products UI matches MongoDB data", async ({ page }) => {
  // Fetch expected data
  const dbData = await getAllProducts();
  const totalData = dbData.length;
  // Open UI
  const productsPage = new ProductsPage(page);
  await productsPage.open();

  // Get UI data
  const uiTotalData = await productsPage.getTableTotalData();

  //   // Normalize
  //   const expected = normalize(dbData);
  //   const actual = normalize(uiData);

  //   // Compare
  expect(totalData).toEqual(uiTotalData);
});
