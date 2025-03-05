import { expect } from '@playwright/test';

export default class EditListingPage {
    constructor(page) {
      this.page = page;
      this.showingConfigurationBtn = page.getByText('Showing Configuration');
      this.autoConfirmrRadioBtn = page.locator('input[type="radio"][data-cy="confirm-auto"]');
      this.enableBtn = page.getByRole('button', { name: 'Enable' });
      this.saveBtn = page.getByRole('button', { name: 'Save' }).first();
      this.cancelBtn = page.locator('button[data-cy="cancel-button"]');
      this.contactFirstNameInputField = page.locator('input[data-cy="edit-contact-input-firstname"]')
      this.contactEmailInputField = page.locator('input[data-cy="edit-contact-email"]');
      this.contactSaveBtn = page.locator('button[data-cy="save-contact-button"]');
      this.continueBtn = page.locator('button[data-cy="popconfirm-ok-button"]');
      this.confirmBtn = page.locator('button[data-cy="ok-button"]');
      this.timeWidget9AM = page.locator('[data-cy="timeWidget-9:00 AM"]');
      this.timeSelectorDoneBtn = page.locator('[data-cy="timeSelectorDone-btn"]');
      this.thirtyMinRadioBtn = page.locator('input.ant-radio-input[value="30"]');
      this.autoConfirmTimeText = page.locator('[data-cy="autoconfirm-time-text"]');
      this.submitAppointmentBtn = page.locator('[data-cy="submit-appointment"]');
      this.agreementModal = page.locator('.ant-modal-confirm-title');
      this.yesIUnderstandBtn = page.locator('button:has-text("Yes, I understand")');
    }
  
    async clickOnShowingConfiguration() {
      await this.showingConfigurationBtn.click();
    }
    async waitForElementToBeStable(element, timeout = 10000) {
        const startTime = Date.now();
        let lastRect = null;
        
        while (Date.now() - startTime < timeout) {
            const currentRect = await element.boundingBox().catch(() => null);            
            if (currentRect && lastRect &&
                currentRect.x === lastRect.x &&
                currentRect.y === lastRect.y) {
                return true; // Element has stabilized
            }
            
            lastRect = currentRect;
            await this.page.waitForTimeout(500); // Check every 500ms
        }
        
        throw new Error('Element position did not stabilize within timeout period');
    }
    async enabledAutoConfirm(contactEmail) {
        await this.autoConfirmrRadioBtn.click({ force: true });
        await this.waitForElementToBeStable(this.enableBtn);
        await this.enableBtn.click({ force: true });
        await this.page.waitForResponse(response => response.url().includes('/config/latoconfirm') && response.status() === 200);
        await this.saveBtn.click();
        await this.page.waitForResponse(response => response.url().includes('appointments/config') && response.status() === 200);
        // await this.confirmBtn.waitFor({ state: 'visible' });
        // await this.confirmBtn.click();
        // await this.page.waitForResponse(response => response.url().includes('/api/listings') && response.status() === 200);

        // await this.cancelBtn.click();
        // await this.contactFirstNameInputField.fill(contactEmail);
        // await this.contactEmailInputField.fill(contactEmail);
        // await this.contactSaveBtn.click();
        // await this.continueBtn.click();
        // await this.autoConfirmrRadioBtn.click();
        // await this.saveBtn.click();
    }
    async setTime9AM() {
        await this.timeWidget9AM.click();
        await this.thirtyMinRadioBtn.check();
        await this.timeSelectorDoneBtn.click();
    }
    async verifyAutoConfirmTimeMessage() {
        await this.autoConfirmTimeText.waitFor({ state: 'visible' });
        await expect(this.autoConfirmTimeText).toContainText('AUTO-CONFIRM TIME SELECTED');
    }
    async submitAppointment() {
        await this.submitAppointmentBtn.click();
    }
    async handleAgreementModal() {
        if (await this.agreementModal.isVisible()) {
            await expect(this.agreementModal).toContainText('Written buyer agreement reminder');
            await this.yesIUnderstandBtn.click();
        }
    }
  }
  