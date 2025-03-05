import { test, expect, chromium } from "@playwright/test";
import PageObjectManager from "../pageObjects/pageOjectManager";
import { createData } from "../customCommands/common/dataFeed.js";
import ReusableFunctions from "../customCommands/common/reusableFunctions";
import listingAPI from "../customCommands/api/services/listingService";
import { login } from "../customCommands/api/services/authService.js";
import { selectBookingDate, } from "../customCommands/ui/dateTimeSelection.js";
import { clickShowingAction, bookShowingInputAgentNameSearch } from "../customCommands/ui/appointment.js";
import moment from "moment";

let uid, org, users, listingAgent, showingAgent, listing, listingID, browser, context, page, page2, poManager;
test.describe.serial("Auto Confirm tests",async () => {
test.beforeAll(async () => {
  browser = await chromium.launch({ headless: false });
  context = await browser.newContext();
  page = await context.newPage();
  poManager = new PageObjectManager(page);
  const data = await createData();
  uid = data.uid;
  org = data.org;
  users = data.users;
  listingAgent = users.agent2;
  showingAgent = users.coop2;
  // await automatonService.addRemoveFeatureFlag(org, "SHOWING_AGENT_SMS", "ADD");
  await login(users.admin4.email, users.admin4.password);
  if (data.duplicateListing) {
    await listingAPI.deleteListing(data.duplicateListing["_id"]);
  }
  listing = await listingAPI.createListingAndConfigureAccess({
    listingAgent,
    statusName: "Exclusive",
    listingType: "freehold",
    type: "sale",
  });
  listingID = listing.id;
});

test.beforeEach(async () => {
  await poManager.getWebBase().navigateTo("/");
});
test.afterEach(async () => {
  await poManager.getDashboardPage().logout();
  await poManager.getLoginPage().loginButton.waitFor();
});
test.afterAll(async () => {
  await browser.close();
});
test("Auto Confirm test for login as admin @regression", async () => {
  await poManager.getLoginPage().login(users.admin4.email, users.admin4.password);
  await poManager.getDashboardPage().dashboardTitle.waitFor();
  await expect(poManager.getDashboardPage().dashboardTitle).toBeVisible();
  await poManager.getWebBase().navigateTo(`/#/listing/${listingID}/view?status=All&location=All&locationAddress=All&avail=All&subject=All&sort_asc=false&searchType=brokerage&type=brokerage&index=0`);
  await poManager.getDashboardPage().clickOnEditList();
  await poManager.getEditListingPage().clickOnShowingConfiguration();
  await poManager.getEditListingPage().enabledAutoConfirm(users.admin4.email);
});
test("Auto Confirm test for login as listing agent @regression", async () => {
  await poManager.getLoginPage().login(listingAgent.email, listingAgent.password);
  await expect(page.locator('[data-cy="dashboard-title"]')).toBeVisible({ timeout: 10000 });
  await poManager.getDashboardPage().dashboardTitle.waitFor();
  await expect(poManager.getDashboardPage().dashboardTitle).toBeVisible();
  await poManager.getWebBase().navigateTo(`/#/listing/${listingID}/view?status=All&location=All&locationAddress=All&avail=All&subject=All&sort_asc=false&searchType=brokerage&type=brokerage&index=0`);
  await clickShowingAction(page, "booking");
  await bookShowingInputAgentNameSearch(page, showingAgent.fullName, showingAgent.id);
  await selectBookingDate(page, moment().add(1, 'days').format('YYYY-MM-DD'));
  await poManager.getEditListingPage().setTime9AM();
  await poManager.getEditListingPage().verifyAutoConfirmTimeMessage();
  await poManager.getEditListingPage().submitAppointment();
  await poManager.getEditListingPage().handleAgreementModal();
  page2 = await context.newPage();
  await page2.goto("https://freeman:72x7yHbDJ2Xut2sA@freeman-qa.brokerbay.com/");
  poManager = new PageObjectManager(page2);
  await poManager.getFreemanPage().searchForEmail(listingAgent.email, "email-appointmentConfirmed");
  await poManager.getFreemanPage().verifyEmailHasBeenConfirmed();
  await page2.close();
  poManager = new PageObjectManager(page);
});
});
