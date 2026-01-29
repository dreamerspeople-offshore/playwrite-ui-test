import { Page, Locator, expect } from "@playwright/test";

export class OrderDashboardPage {
  readonly page: Page;

  // Accordion
  readonly accordion: Locator;
  readonly panels: Locator;

  // Combined table + custom form
  readonly combinedTable: Locator;
  readonly customForm: Locator;

  constructor(page: Page) {
    this.page = page;

    // Accordion root
    this.accordion = page.locator("mat-accordion");
    console.log("mat-accordion", this.accordion);

    // All expansion panels
    this.panels = page.locator("mat-expansion-panel");

    // Lazy-loaded components
    this.combinedTable = page.locator("app-combined-table");
    this.customForm = page.locator("app-customform");
  }

  async goto() {
    await this.page.goto("http://localhost:4200/order-dashboard", {
      waitUntil: "domcontentloaded",
      timeout: 30000,
    });

    // Angular bootstrap
    await this.page.waitForSelector("app-root", {
      timeout: 30000,
    });

    // First visible UI element
    await this.page.waitForSelector("mat-expansion-panel-header", {
      state: "visible",
      timeout: 30000,
    });
  }

  async openAccordionByTitle(title: string) {
    const header = this.page
      .locator("mat-expansion-panel-header")
      .filter({ hasText: title });

    await expect(header).toBeVisible();
    await header.click();

    // Wait for lazy content
    await expect(this.combinedTable).toBeVisible();
  }

  async openAccordionByIndex(index: number) {
    const panel = this.panels.nth(index);
    await expect(panel).toBeVisible();

    await panel.locator("mat-expansion-panel-header").click();
    await expect(this.combinedTable).toBeVisible();
  }

  async fillTextField(label: string, value: string) {
    const input = this.customForm.getByLabel(label);
    await expect(input).toBeVisible();
    await input.fill(value);
  }

  async selectMatOption(label: string, searchText: string, option: string) {
    const select = this.customForm.getByLabel(label);
    await select.click();

    const searchInput = this.page.locator(
      'mat-select input[placeholder*="Search"]',
    );
    await searchInput.fill(searchText);

    await this.page.getByRole("option", { name: option }).click();
  }

  async expectTableVisible() {
    await expect(this.combinedTable.locator("table")).toBeVisible();
  }

  async expectRowsPresent() {
    // await expect(this.combinedTable.locator("tbody tr")).toHaveCountGreaterThan(
    //   0,
    // );
  }

  async submitForm() {
    const submitBtn = this.customForm.getByRole("button", {
      name: "Submit",
    });
    await expect(submitBtn).toBeEnabled();
    await submitBtn.click();
  }

  async clearForm() {
    await this.customForm
      .getByRole("button", {
        name: "Clear",
      })
      .click();
  }
}
