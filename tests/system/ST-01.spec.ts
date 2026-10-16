import { test, expect } from '@playwright/test';

test('ST-01: complete purchase of two products', {
  annotation: {
    type: 'description',
    description: 'ทดสอบการซื้อ Backpack และ Bike Light ตั้งแต่ Login จนสั่งซื้อสำเร็จ'
  }
}, async ({ page }) => {

  await test.step('Login และตรวจสอบ Inventory', async () => {
    // Login จริงผ่าน SauceDemo
    await page.goto('/');
    await page.locator('[data-test="username"]').fill('standard_user');
    await page.locator('[data-test="password"]').fill('secret_sauce');
    await page.locator('[data-test="login-button"]').click();
    await expect(page).toHaveURL(/.*inventory.html/);
    await expect(page.locator('.title')).toHaveText('Products');
  });

  await test.step('เพิ่มสินค้าสองรายการ', async () => {
    // เพิ่ม Backpack และ Bike Light ตรวจสอบ Badge = 2
    await page.locator('[data-test="add-to-cart-sauce-labs-backpack"]').click();
    await page.locator('[data-test="add-to-cart-sauce-labs-bike-light"]').click();

    const cartBadge = page.locator('[data-test="shopping-cart-badge"]');
    await expect(cartBadge).toBeVisible();
    await expect(cartBadge).toHaveText('2');
  });

  await test.step('ตรวจสอบ Cart', async () => {
    // ตรวจสอบชื่อสินค้าทั้งสองรายการ
    await page.locator('[data-test="shopping-cart-link"]').click();
    await expect(page).toHaveURL(/.*cart.html/);

    const cartItems = page.locator('.cart_item');
    await expect(cartItems).toHaveCount(2);

    const backpack = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    const bikeLight = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });
    await expect(backpack).toBeVisible();
    await expect(bikeLight).toBeVisible();
  });

  await test.step('กรอก Checkout Information', async () => {
    // กรอกข้อมูลลูกค้าและกด Continue
    await page.locator('[data-test="checkout"]').click();
    await expect(page).toHaveURL(/.*checkout-step-one.html/);

    await page.locator('[data-test="firstName"]').fill('Jiraphat');
    await page.locator('[data-test="lastName"]').fill('Kettra');
    await page.locator('[data-test="postalCode"]').fill('68041');
    await page.locator('[data-test="continue"]').click();
  });

  await test.step('ตรวจสอบ Overview และสั่งซื้อ', async () => {
    // ตรวจสอบรายการสินค้าแล้วกด Finish
    await expect(page).toHaveURL(/.*checkout-step-two.html/);

    const overviewItems = page.locator('.cart_item');
    await expect(overviewItems).toHaveCount(2);

    const backpack = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Backpack' });
    const bikeLight = page.locator('.inventory_item_name', { hasText: 'Sauce Labs Bike Light' });
    await expect(backpack).toBeVisible();
    await expect(bikeLight).toBeVisible();

    await page.locator('[data-test="finish"]').click();
  });

  await test.step('ตรวจสอบ Order Complete', async () => {
    // ตรวจสอบข้อความ Thank you for your order!
    await expect(page).toHaveURL(/.*checkout-complete.html/);
    const completeHeader = page.locator('[data-test="complete-header"]');
    await expect(completeHeader).toBeVisible();
    await expect(completeHeader).toHaveText('Thank you for your order!');
  });

});
