import WebBase from "./webBase";
import LoginPage from "./loginPage";
import DashboardPage from "./dashboardPage";
import EditListingPage from "./editListingPage";
import ListingViewPage from "./listingViewPage";
import BookShowingPage from "./bookShowingPage";
import FreemanPage from "./freemanPage";

export default class pageObjectManager {
  constructor(page) {
    this.page = page;
    this.webBase = new WebBase(this.page);
    this.loginPage = new LoginPage(this.page);
    this.dashboardPage = new DashboardPage(this.page);
    this.editListingPage = new EditListingPage(this.page);
    this.ListingViewPage = new ListingViewPage(this.page);
    this.bookShowingPage = new BookShowingPage(this.page);
    this.freemanPage = new FreemanPage(this.page);
  }

  getWebBase() {
    return this.webBase;
  }
  getLoginPage() {
    return this.loginPage;
  }
  getDashboardPage() {
    return this.dashboardPage;
  }
  getEditListingPage() {
    return this.editListingPage;
  }
  getListingViewPage() {
    return this.ListingViewPage;
  }
  getBookShowingPage() {
    return this.bookShowingPage;
  }
  getFreemanPage() {
    return this.freemanPage;
  }
}
