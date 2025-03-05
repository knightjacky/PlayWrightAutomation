import { expect } from '@playwright/test';

export default class FreemanPage {
  constructor(page) {
    this.page = page;
    this.searchBar = page.locator('input[placeholder="Search here"]');
    this.refreshBtn = page.locator('button[data-cy="fetch-data-button"]');
    this.emailDetailsBtn = page.getByRole('button', { name: 'icon: eye' });
    this.emailDetailsTitle = page.getByText('The following showing has been confirmed', { exact: false }).first();
  }

  async searchForEmail(email, message) {
    await this.searchBar.waitFor();
    await this.searchBar.fill(email);
    await this.page.waitForSelector(`text=${message}`, {timeout: 30000,state: 'visible',polling: 1000});
    await this.page.waitForSelector('text=Showing Confirmed - ', {timeout: 3000, state: 'visible'});
    await this.refreshBtn.click();
    await this.page.waitForTimeout(500);
    await this.emailDetailsBtn.last().waitFor();
    await this.emailDetailsBtn.first().click();
  }
  async verifyEmailHasBeenConfirmed() {
    await this.emailDetailsTitle.waitFor({state: 'visible', timeout: 5000});
    await expect(this.emailDetailsTitle).toBeVisible();
  }
}
