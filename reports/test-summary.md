# รายงานสรุปผลการทดสอบ (Test Summary Report)

**รายวิชา:** Software Testing  
**การสอบ:** ข้อสอบปลายภาค Software Testing ด้วย Playwright  
**ระบบสำหรับทดสอบ:** [SauceDemo](https://www.saucedemo.com/)  
**ผู้จัดทำ:** นายจิรภัทร เกตุตรา  
**รหัสนักศึกษา:** 6804101311  
**วันที่ทดสอบ:** 16 ตุลาคม 2026  

---

## 1. ภาพรวมผลการทดสอบ (Executive Summary)

- **จำนวน Test Suites ทั้งหมด:** 6 Suites (3 บท บทละ 2 Suites)
- **จำนวน Test Cases ทั้งหมด:** 8 Cases
- **ผลการทดสอบผ่าน (Passed):** 8 Cases (100%)
- **ผลการทดสอบไม่ผ่าน (Failed):** 0 Cases (0%)
- **ข้ามการทดสอบ (Skipped):** 0 Cases
- **เวลารวมในการทดสอบ:** ~8.25 วินาที
- **เบราว์เซอร์ที่ใช้ทดสอบ:** Chromium (Desktop Chrome) ผ่าน Playwright Test

---

## 2. ตารางสรุปผลการทดสอบรายข้อ

| บทที่ | รหัสข้อ | ชื่อ Test ใน Playwright Report | ผลลัพธ์ | ระยะเวลา |
| :--- | :--- | :--- | :---: | :---: |
| 1. Unit Testing | UT-01.1 | `UT-01.1: empty username and password` | **PASSED** | 576ms |
| 1. Unit Testing | UT-01.2 | `UT-01.2: missing password` | **PASSED** | 556ms |
| 1. Unit Testing | UT-01.3 | `UT-01.3: invalid login details` | **PASSED** | 600ms |
| 1. Unit Testing | UT-02 | `UT-02: product button state Add to cart -> Remove -> Add to cart` | **PASSED** | 776ms |
| 2. Integration Testing | IT-01 | `IT-01: top-down REAL Login -> browser-level Inventory STUB` | **PASSED** | 959ms |
| 2. Integration Testing | IT-02 | `IT-02: DRIVER login state -> REAL Inventory and Cart` | **PASSED** | 1.5s |
| 3. System Testing | ST-01 | `ST-01: complete purchase of two products` | **PASSED** | 1.1s |
| 3. System Testing | ST-02 | `ST-02: checkout validation and recovery` | **PASSED** | 1.2s |

---

## 3. รายละเอียดการทดสอบแต่ละข้อ

### 3.1 บทที่ 1: Unit Testing / UI Component Testing

#### ข้อ 1: UT-01 Login Form Validation (`tests/unit/UT-01.spec.ts`)
- **UT-01.1 (empty username and password):** ทดสอบการกดปุ่ม Login โดยไม่กรอกข้อมูลใด ๆ ระบบแสดงข้อความแจ้งเตือน `Epic sadface: Username is required` ถูกต้อง และไม่นำผู้ใช้เข้าสู่หน้า Inventory (`PASSED`)
- **UT-01.2 (missing password):** ทดสอบการกรอกเฉพาะ Username `standard_user` แล้วกด Login ระบบแสดงข้อความแจ้งเตือน `Epic sadface: Password is required` ถูกต้อง และไม่นำผู้ใช้เข้าสู่หน้า Inventory (`PASSED`)
- **UT-01.3 (invalid login details):** ทดสอบการกรอก Username และ Password ที่ไม่ถูกต้อง (`invalid_user` / `wrong_password`) ระบบแสดงข้อความแจ้งเตือน `Epic sadface: Username and password do not match any user in this service` ถูกต้อง และไม่นำผู้ใช้เข้าสู่หน้า Inventory (`PASSED`)

#### ข้อ 2: UT-02 Product Button State Validation (`tests/unit/UT-02.spec.ts`)
- **UT-02:** ทดสอบการเปลี่ยนสถานะของปุ่มสินค้า Sauce Labs Backpack:
  - ก่อนเพิ่มสินค้า: ปุ่มแสดง `Add to cart`
  - หลังคลิกเพิ่มสินค้า: ปุ่มเปลี่ยนเป็น `Remove` และ Cart Badge แสดงตัวเลข `1`
  - หลังคลิกลบสินค้า: ปุ่มกลับมาเป็น `Add to cart` และ Cart Badge หายไป (`PASSED`)

---

### 3.2 บทที่ 2: Integration Testing

#### ข้อ 3: IT-01 Top-Down Integration Testing with Stub (`tests/integration/IT-01.spec.ts`)
- **IT-01:**
  - Login จริงผ่านหน้าเว็บ SauceDemo สำเร็จและยืนยัน URL `inventory.html`
  - ทำการ Stub ระดับเบราว์เซอร์ด้วย `page.setContent()`
  - ตรวจสอบ Stub แสดงข้อความ `Mock Inventory Ready` และแสดงสินค้าจำลอง 2 รายการ ได้แก่ `Mock Backpack` และ `Mock Bike Light` ครบถ้วนถูกต้อง (`PASSED`)

#### ข้อ 4: IT-02 Bottom-Up Integration Testing with Driver (`tests/integration/IT-02.spec.ts`)
- **IT-02:**
  - ใช้ฟังก์ชัน Driver `driverOpenInventory()` ตั้งค่า Cookie `session-username` เป็น `standard_user` บนโดเมน `www.saucedemo.com`
  - เปิดหน้า `inventory.html` โดยตรงโดยไม่ผ่านแบบฟอร์ม Login
  - ทดสอบการทำงานจริงของหน้า Inventory พบสินค้า 6 รายการ
  - เพิ่ม Sauce Labs Backpack และ Sauce Labs Bike Light ลงตะกร้า Cart Badge แสดง `2`
  - เปิดหน้า Cart จริง ตรวจสอบพบสินค้าทั้ง 2 รายการถูกต้อง (`PASSED`)

---

### 3.3 บทที่ 3: System Testing

#### ข้อ 5: ST-01 Complete Purchase Flow (`tests/system/ST-01.spec.ts`)
- **ST-01:**
  - ทดสอบกระบวนการซื้อสินค้าแบบ End-to-End ครบวงจรตั้งแต่ Login เข้าสู่ระบบ
  - เพิ่มสินค้า 2 ชิ้น (Backpack และ Bike Light) เข้าตะกร้า
  - ดำเนินการ Checkout กรอกข้อมูลลูกค้า (First Name, Last Name, Postal Code)
  - ตรวจสอบรายการในหน้า Checkout Overview
  - ยืนยันการสั่งซื้อ Finish และตรวจสอบข้อความยืนยันสำเร็จ `Thank you for your order!` (`PASSED`)

#### ข้อ 6: ST-02 Checkout Validation and Recovery (`tests/system/ST-02.spec.ts`)
- **ST-02:**
  - เพิ่มสินค้าเข้าตะกร้าและเปิดหน้า Checkout
  - ตรวจสอบ Error Validation เมื่อไม่กรอกข้อมูล (`First Name is required`)
  - ตรวจสอบ Error Validation เมื่อกรอกเฉพาะ First Name (`Last Name is required`)
  - ตรวจสอบ Error Validation เมื่อยังไม่กรอก Postal Code (`Postal Code is required`)
  - กรอกรหัสไปรษณีย์ครบถ้วนแล้วเข้าสู่หน้า Overview สั่งซื้อสำเร็จและได้รับข้อความ `Thank you for your order!` (`PASSED`)

---

## 4. สรุปข้อผิดพลาดที่พบ (Issues & Anomalies)

- **ข้อผิดพลาดในการทดสอบ:** ไม่พบข้อผิดพลาด ทุกเงื่อนไขและ Assertion ทำงานถูกต้องและผ่านทั้งหมด 100%
