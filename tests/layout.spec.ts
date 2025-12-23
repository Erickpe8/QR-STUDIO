import { test, expect } from "@playwright/test";
import { goToContentStep, goToDesignStep } from "./utils";

test.describe("QR Studio editor layout", () => {
    test("Step 1 no renderiza preview ni columnas extras", async ({ page }) => {
        await page.goto("/");
        await expect(page.locator("#preview-column")).toHaveCount(0);
        await expect(page.locator(".main-content")).toHaveCount(0);
    });

    test("Step 1 selecciona tipo y avanza al contenido", async ({ page }) => {
        await page.goto("/");
        await page.click('[data-qr-type="wifi"]');
        await expect(page.locator("#options-column input").first()).toBeVisible({ timeout: 5000 });
        await expect(page.locator("#preview-column")).toBeVisible({ timeout: 5000 });
    });

    test("Step 2 mantiene formulario izquierdo y preview sticky derecho", async ({ page }) => {
        await goToContentStep(page);
        await page.setViewportSize({ width: 1280, height: 900 });

        const leftColumn = page.locator("#options-column");
        const previewColumn = page.locator("#preview-column");
        await expect(leftColumn).toBeVisible();
        await expect(previewColumn).toBeVisible();

        const leftColumnY = (await leftColumn.boundingBox())?.y ?? 0;
        const previewColumnY = (await previewColumn.boundingBox())?.y ?? 0;
        expect(Math.abs(leftColumnY - previewColumnY)).toBeLessThan(20);

        const isRight = await previewColumn.evaluate(preview => {
            const left = document.getElementById("options-column");
            if (!left) return false;
            return preview.offsetLeft >= left.offsetLeft + left.offsetWidth - 8;
        });
        expect(isRight).toBe(true);
    });

    test("Step 3 mantiene preview sticky alineado", async ({ page }) => {
        await goToDesignStep(page);
        await page.setViewportSize({ width: 1280, height: 900 });

        const leftColumn = page.locator("#options-column");
        const previewColumn = page.locator("#preview-column");
        await expect(leftColumn).toBeVisible();
        await expect(previewColumn).toBeVisible();

        const isRight = await previewColumn.evaluate(preview => {
            const left = document.getElementById("options-column");
            if (!left) return false;
            return preview.offsetLeft >= left.offsetLeft + left.offsetWidth - 8;
        });
        expect(isRight).toBe(true);
    });
});
