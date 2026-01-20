import { test, expect } from "@playwright/test";
import { LoginPage } from "../pages/login.page";

test("login works", async ({ page }) => {
  const loginPage = new LoginPage(page);


  await loginPage.goto();
  await loginPage.login("admin@gmail.com", "123456");
  page.getByTestId("totaldata");
  await expect(page.locator("h1")).toHaveText("Dashboard");
});
