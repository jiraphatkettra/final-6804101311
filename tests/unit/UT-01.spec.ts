import { test, expect } from '@playwright/test';

test.describe('UT-01: Login Form Validation', () => {

  test('UT-01.1: empty username and password', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อไม่กรอก Username และ Password' }
  }, async ({ page }) => {

    await test.step('เปิดหน้า Login', async () => {
      // เปิดเว็บไซต์ SauceDemo
      await page.goto('/');
      await expect(page.locator('[data-test="login-button"]')).toBeVisible();
    });

    await test.step('ส่งฟอร์มโดยไม่กรอกข้อมูล', async () => {
      // กดปุ่ม Login
      await page.locator('[data-test="login-button"]').click();
    });

    await test.step('ตรวจสอบ Error และ URL', async () => {
      // ตรวจสอบ Username is required และไม่เข้าสู่ Inventory
      const errorLocator = page.locator('[data-test="error"]');
      await expect(errorLocator).toBeVisible();
      await expect(errorLocator).toContainText('Username is required');
      expect(page.url()).not.toContain('inventory.html');
      await expect(page).not.toHaveURL(/.*inventory.html/);
    });

  });

  test('UT-01.2: missing password', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อกรอก Username แต่ไม่กรอก Password' }
  }, async ({ page }) => {

    await test.step('เปิดหน้า Login และกรอก Username', async () => {
      // กรอก standard_user
      await page.goto('/');
      await page.locator('[data-test="username"]').fill('standard_user');
    });

    await test.step('กด Login โดยไม่กรอก Password', async () => {
      // ส่งฟอร์ม
      await page.locator('[data-test="login-button"]').click();
    });

    await test.step('ตรวจสอบ Error และ URL', async () => {
      // ตรวจสอบ Password is required และไม่เข้าสู่ Inventory
      const errorLocator = page.locator('[data-test="error"]');
      await expect(errorLocator).toBeVisible();
      await expect(errorLocator).toContainText('Password is required');
      expect(page.url()).not.toContain('inventory.html');
      await expect(page).not.toHaveURL(/.*inventory.html/);
    });

  });

  test('UT-01.3: invalid login details', {
    annotation: { type: 'description', description: 'ตรวจสอบการ Login เมื่อ Username และ Password ไม่ถูกต้อง' }
  }, async ({ page }) => {

    await test.step('เปิดหน้า Login และกรอกข้อมูลผิด', async () => {
      // กรอก invalid_user / wrong_password
      await page.goto('/');
      await page.locator('[data-test="username"]').fill('invalid_user');
      await page.locator('[data-test="password"]').fill('wrong_password');
    });

    await test.step('กด Login', async () => {
      // ส่งฟอร์ม
      await page.locator('[data-test="login-button"]').click();
    });

    await test.step('ตรวจสอบ Error และ URL', async () => {
      // ตรวจสอบข้อความแจ้งข้อมูลไม่ถูกต้อง และไม่เข้าสู่ Inventory
      const errorLocator = page.locator('[data-test="error"]');
      await expect(errorLocator).toBeVisible();
      await expect(errorLocator).toContainText('Username and password do not match any user in this service');
      expect(page.url()).not.toContain('inventory.html');
      await expect(page).not.toHaveURL(/.*inventory.html/);
    });

  });

});
