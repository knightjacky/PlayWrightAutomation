export default class DashboardPage {
  constructor(page) {
    this.page = page;
    this.dashboardTitle = page.locator('[data-cy="dashboard-title"]');
    this.editListingBtn = page.locator('a', { hasText: 'Edit Listing'}).first();
    this.avatarButton = page.locator('[data-cy="avatar-button"]');
    this.logoutButton = page.locator('[data-cy="logout-button"]');
  }

  async clickOnEditList() {
    await this.editListingBtn.waitFor();
    await this.editListingBtn.click();
  }
  async logout() {
    await this.avatarButton.waitFor({ state: 'visible', timeout: 5000});
    await this.avatarButton.click();
    await this.logoutButton.waitFor({ state: 'visible', timeout: 5000});
    await this.logoutButton.click();
  }
}
