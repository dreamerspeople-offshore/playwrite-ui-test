import { Page, Locator } from "@playwright/test";

export class LoginPage {
  private email: Locator;
  private password: Locator;
  private loginBtn: Locator;

  constructor(private page: Page) {
    this.email = page.locator("#email");
    this.password = page.locator("#password");
    this.loginBtn = page.locator("#login-btn");
  }

  async goto() {
    await this.page.goto("/login");
  }

  async login(email: string, pass: string) {
    console.log(this.email);

    await this.email.fill(email);
    await this.password.fill(pass);
    await this.loginBtn.click();
  }
}
