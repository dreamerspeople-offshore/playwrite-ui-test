import { test, expect } from "@playwright/test";

test.describe("Power BI Gallery Report - UI Smoke Test", () => {
  test("Login, open report, verify visuals load", async ({ page }) => {
    // 1️⃣ Open Power BI
    await page.goto("https://app.powerbi.com");

    // 2️⃣ Microsoft Login
    await page
      .getByPlaceholder("Email, phone, or Skype")
      .fill(process.env.PBI_USER!);

    await page.getByRole("button", { name: "Next" }).click();

    await page.getByPlaceholder("Password").fill(process.env.PBI_PASSWORD!);

    await page.getByRole("button", { name: "Sign in" }).click();

    // "Stay signed in?"
    const yesBtn = page.getByRole("button", { name: "Yes" });
    if (await yesBtn.isVisible()) {
      await yesBtn.click();
    }

    // 3️⃣ Open the specific Power BI report
    await page.goto(
      "https://app.powerbi.com/discover/gallery/0579b437-67ba-4acf-b2c8-4bebc64b9899",
    );

    // 4️⃣ Wait for Power BI iframe
    const reportFrame = page.frameLocator('iframe[src*="powerbi"]');

    // 5️⃣ Wait for visuals to render (canvas = visuals)
    const canvas = reportFrame.locator("canvas").first();
    await canvas.waitFor({
      state: "visible",
      timeout: 60_000,
    });

    // 6️⃣ Assertions (SAFE & STABLE)

    // Page loaded
    await expect(page).toHaveURL(/powerbi\.com/);

    // At least one visual rendered
    const visualCount = await reportFrame.locator("canvas").count();
    expect(visualCount).toBeGreaterThan(0);

    // Report title exists somewhere
    await expect(page.getByText("Power BI", { exact: false })).toBeVisible();

    console.log(`✅ Power BI visuals loaded: ${visualCount}`);
  });
});
