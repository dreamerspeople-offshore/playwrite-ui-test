import { test, expect } from "@playwright/test";
import { OrderDashboardPage } from "../pages/order-dashboard.page";

test.describe("Order Dashboard – Accordion + Combined Table", () => {
  let pageObj: OrderDashboardPage;

  test.beforeEach(async ({ page }) => {
    pageObj = new OrderDashboardPage(page);
    await pageObj.goto();
  });

  test("should load order dashboard with accordion", async () => {
    await expect(pageObj.accordion).toBeVisible();
  });

//   test("should open first accordion and load table", async () => {
//     await pageObj.openAccordionByIndex(0);
//     await pageObj.expectTableVisible();
//   });

//   test("should open accordion by title and interact with form", async () => {
//     await pageObj.openAccordionByTitle("Orders");

//     await pageObj.fillTextField("Order Name", "Playwright Order");
//     await pageObj.selectMatOption("Status", "Active", "Active");

//     await pageObj.submitForm();
//   });

//   test("should verify table rows after data load", async () => {
//     await pageObj.openAccordionByIndex(0);
//     await pageObj.expectRowsPresent();
//   });

//   test("should clear form inside custom form", async () => {
//     await pageObj.openAccordionByIndex(0);
//     await pageObj.clearForm();
//   });
});
