import { Locator, Page } from "@playwright/test";

export class ProductsPage {
  private totalData: Locator;
  private tableRows: Locator;

  constructor(private readonly page: Page) {
    // Initialize locators once
    this.totalData = page.locator("#totaldata");
    this.tableRows = page.locator("table tbody tr");
  }

  async open(): Promise<void> {
    await this.page.goto("/product");
    await this.page.waitForResponse(
      (r) => r.url().includes("/api/products/list") && r.status() === 200,
    );

    await this.totalData.waitFor({ state: "visible" });
  }

  async getTableData(): Promise<
    { name: string | null; email: string | null; role: string | null }[]
  > {
    await this.tableRows.first().waitFor({ state: "visible" });

    return this.tableRows.evaluateAll((rows) =>
      rows.map((row) => {
        const cells = row.querySelectorAll("td");
        return {
          name: cells[0]?.textContent?.trim() ?? null,
          email: cells[1]?.textContent?.trim() ?? null,
          role: cells[2]?.textContent?.trim() ?? null,
        };
      }),
    );
  }

  async getTableTotalData(): Promise<number> {
    await this.totalData.waitFor({ state: "visible" });

    const totalEntriesText = await this.totalData.textContent();
    const totalEntries = Number(totalEntriesText?.trim());

    if (Number.isNaN(totalEntries)) {
      throw new Error(
        `Total entries is not a number. Found: "${totalEntriesText}"`,
      );
    }

    return totalEntries;
  }
}
