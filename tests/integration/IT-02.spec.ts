import { test, expect, BrowserContext, Page } from '@playwright/test';

// ฟังก์ชัน Driver สำหรับเตรียมสถานะ Login และเปิดหน้า Inventory โดยตรง
async function driverOpenInventory(context: BrowserContext, page: Page) {
  await context.addCookies([
    {
      name: 'session-username',
      value: 'standard_user',
      domain: 'www.saucedemo.com',
      path: '/',
    },
  ]);
  await page.goto('https://www.saucedemo.com/inventory.html');
}

test('IT-02: DRIVER login state -> REAL Inventory and Cart', {
  annotation: {
    type: 'description',
    description: 'ใช้ Driver เตรียมสถานะ Login เพื่อทดสอบ Inventory และ Cart จริง'
  }
}, async ({ browser }) => {

  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await test.step('สร้าง Driver และเปิด Inventory', async () => {
      // สร้าง BrowserContext และใช้ driverOpenInventory() ตั้งค่า Cookie
      await driverOpenInventory(context, page);
      await expect(page).toHaveURL(/.*inventory.html/);
    });

    await test.step('ตรวจสอบ Inventory จริง', async () => {
      // ตรวจสอบสินค้า 6 รายการ
      const inventoryItems = page.locator('.inventory_item');
      await expect(inventoryItems).toHaveCount(6);
    });

    await test.step('เพิ่มสินค้า 2 รายการ', async () => {
      // เพิ่ม Backpack และ Bike Light แล้วตรวจสอบ Cart Badge = 2
      await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
      await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

      const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
      await expect(cartBadge).toBeVisible();
      await expect(cartBadge).toHaveText('2');
    });

    await test.step('ตรวจสอบสินค้าใน Cart', async () => {
      // เปิด Cart และตรวจสอบชื่อสินค้าทั้งสองรายการ
      await page.locator('[data-test="shopping-cart-link"]').click();
      await expect(page).toHaveURL(/.*cart.html/);

      const cartItems = page.locator('.cart_item');
      await expect(cartItems).toHaveCount(2);

      const backpack = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
      const bikeLight = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });

      await expect(backpack).toBeVisible();
      await expect(bikeLight).toBeVisible();
    });
  } finally {
    // ปิด BrowserContext ที่สร้างเองเมื่อสิ้นสุดการทดสอบ
    await context.close();
  }

});
