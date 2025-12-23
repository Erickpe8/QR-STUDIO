import { Page } from "@playwright/test";

export async function openModule(page: Page, typeId: string, readySelector: string) {
    await page.goto("/");
    await page.click(`[data-qr-type="${typeId}"]`);
    await page.waitForSelector(readySelector);
}

export async function goToContentStep(page: Page, typeId = "url") {
    await openModule(page, typeId, "#qr-url-input");
}

export async function goToDesignStep(page: Page) {
    await goToContentStep(page);
    await page.fill("#qr-url-input", "https://example.com");
    await page.click("#qr-content-next");
    await page.waitForSelector("#back-to-content");
}
