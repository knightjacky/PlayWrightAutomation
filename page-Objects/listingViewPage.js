export default class ListingViewPage {
    constructor(page) {
      this.page = page;
      this.bookShowingBtn = page.getByRole('link', { name: 'Book Showing' });
    }
  
    async clickOnBookShowingBtn() {
      await this.bookShowingBtn.waitFor();
      await this.bookShowingBtn.click();
    }
  }
  