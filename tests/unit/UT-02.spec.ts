import { test, expect } from '@playwright/test';

test('UT-02: product button state Add to cart -> Remove -> Add to cart', {
  annotation: {
    type: 'description',
    description: 'ตรวจสอบสถานะปุ่ม Add to cart และ Remove รวมถึง Cart Badge'
  }
}, async ({ page }) => {

  await test.step('Login เข้าสู่ระบบ', async () => {
    // Login และตรวจสอบหน้า Inventory
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  await test.step('ตรวจสอบปุ่มก่อนเพิ่มสินค้า', async () => {
    // ตรวจสอบปุ่ม Add to cart ของ Backpack
    const backpackButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(backpackButton).toBeVisible();
    await expect(backpackButton).toHaveText('Add to cart');
  });

  await test.step('เพิ่มสินค้าเข้า Cart', async () => {
    // เพิ่มสินค้าและตรวจสอบปุ่ม Remove และ Cart Badge = 1
    const backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await backpackAddButton.click();

    const backpackRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await expect(backpackRemoveButton).toBeVisible();
    await expect(backpackRemoveButton).toHaveText('Remove');

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('1');
  });

  await test.step('ลบสินค้าออกจาก Cart', async () => {
    // ลบสินค้า ตรวจสอบปุ่ม Add to cart และ Cart Badge หายไป
    const backpackRemoveButton = page.locator('[data-test="remove-sauce-labs-backpack"]');
    await backpackRemoveButton.click();

    const backpackAddButton = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
    await expect(backpackAddButton).toBeVisible();
    await expect(backpackAddButton).toHaveText('Add to cart');

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toHaveCount(0);
  });

});
