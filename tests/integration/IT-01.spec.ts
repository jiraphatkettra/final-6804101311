import { test, expect } from '@playwright/test';

test('IT-01: top-down REAL Login -> browser-level Inventory STUB', {
  annotation: {
    type: 'description',
    description: 'ทดสอบ Login จริงร่วมกับ Inventory Stub ที่จำลองด้วย page.setContent()'
  }
}, async ({ page }) => {

  await test.step('Login ผ่านหน้าเว็บไซต์จริง', async () => {
    // Login และตรวจสอบ URL inventory.html
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
  });

  await test.step('สร้าง Inventory Stub', async () => {
    // ใช้ page.setContent() แสดง Mock Inventory Ready และสินค้าจำลอง 2 รายการ
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <title>Mock Inventory</title>
      </head>
      <body>
        <div id="mock-inventory-container">
          <h1 id="mock-status">Mock Inventory Ready</h1>
          <div class="inventory-list">
            <div class="inventory-item" data-test="inventory-item">
              <span class="inventory-item-name">Mock Backpack</span>
            </div>
            <div class="inventory-item" data-test="inventory-item">
              <span class="inventory-item-name">Mock Bike Light</span>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  });

  await test.step('ตรวจสอบผลจาก Stub', async () => {
    // ตรวจสอบข้อความ จำนวน และชื่อสินค้าจำลอง
    const mockReadyText = page.getByText('Mock Inventory Ready');
    await expect(mockReadyText).toBeVisible();

    const items = page.locator('.inventory-item');
    await expect(items).toHaveCount(2);

    const backpackItem = page.getByText('Mock Backpack');
    await expect(backpackItem).toBeVisible();

    const bikeLightItem = page.getByText('Mock Bike Light');
    await expect(bikeLightItem).toBeVisible();
  });

});
