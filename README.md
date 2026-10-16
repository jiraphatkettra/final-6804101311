# ข้อสอบปลายภาค Software Testing ด้วย Playwright

**รายวิชา:** Software Testing  
**ระบบสำหรับทดสอบ:** [SauceDemo](https://www.saucedemo.com/)  
**ผู้จัดทำ:** นายจิรภัทร เกตุตรา  
**รหัสนักศึกษา:** 6804101311  
**GitHub Repository:** `final-6804101311`  

---

## 1. คำอธิบายภาพรวมโครงสร้างโปรเจกต์

โปรเจกต์นี้เป็นการทดสอบระบบเว็บแอปพลิเคชัน SauceDemo ด้วย Playwright Test (TypeScript) โดยครอบคลุมการทดสอบทั้ง 3 ระดับตามที่กำหนดในข้อสอบ:
1. **บทที่ 1: Unit Testing / UI Component Testing** (UT-01, UT-02)
2. **บทที่ 2: Integration Testing** (IT-01, IT-02)
3. **บทที่ 3: System Testing** (ST-01, ST-02)

### โครงสร้างไฟล์ใน Repository

```
final-6804101311/
├── README.md
├── package.json
├── package-lock.json
├── playwright.config.ts
├── tests/
│   ├── unit/
│   │   ├── UT-01.spec.ts
│   │   └── UT-02.spec.ts
│   ├── integration/
│   │   ├── IT-01.spec.ts
│   │   └── IT-02.spec.ts
│   └── system/
│       ├── ST-01.spec.ts
│       └── ST-02.spec.ts
├── playwright-report/
│   └── index.html
└── reports/
    ├── results.json
    └── test-summary.md
```

---

## 2. คำอธิบาย Integration Testing: Real vs Stub / Driver

### 2.1 ข้อ 3: Top-Down Integration Testing ด้วย Stub (IT-01)

ในการทดสอบแบบ Top-Down Integration Testing:
- **ส่วนที่เป็น Real (ของจริง):**
  - **ขั้นตอน Login ผ่านหน้าเว็บจริง:** เป็นการทำงานบนระบบจริงของ SauceDemo โดยเปิดหน้า `https://www.saucedemo.com/` กรอกข้อมูล Username `standard_user` และ Password `secret_sauce` จริง และส่งฟอร์มเพื่อตรวจสอบว่าระบบสามารถตรวจสอบสิทธิ์และเปลี่ยนเส้นทางไปยังหน้า `inventory.html` ได้จริง
- **ส่วนที่เป็น Stub (ของจำลอง):**
  - **หน้า Inventory Stub:** จำลองการทำงานของหน้าแสดงสินค้าด้วยคำสั่ง `page.setContent()` ในระดับ Browser DOM โดยสร้างองค์ประกอบ HTML จำลองขึ้นมาเพื่อทดสอบการตอบสนองและการแสดงผลแทนที่หน้า Inventory จริงของ SauceDemo
  - ข้อความจำลอง `Mock Inventory Ready` และรายการสินค้าจำลอง 2 รายการ ได้แก่ `Mock Backpack` และ `Mock Bike Light` เพื่อใช้ยืนยันว่า Component หรือระบบส่วนถัดไปสามารถรับและแสดงผลข้อมูลสินค้าจำลองได้ตามสเปก โดยไม่ต้องพึ่งพาข้อมูลจริงจาก Backend

### 2.2 ข้อ 4: Bottom-Up Integration Testing ด้วย Driver (IT-02)

ในการทดสอบแบบ Bottom-Up Integration Testing:
- **บทบาทของ Driver:**
  - **ฟังก์ชัน `driverOpenInventory(context, page)`:** ทำหน้าที่เป็น Test Driver ในการจัดเตรียมสถานะก่อนการทดสอบ (Preconditions Setup) โดยไม่ต้องผ่าน UI Form Login ของระดับบน
  - Driver จะทำการฉีด Cookie การยืนยันตัวตน `session-username=standard_user` ลงใน `BrowserContext` บนโดเมน `www.saucedemo.com` และนำทางเบราว์เซอร์เปิดหน้า `https://www.saucedemo.com/inventory.html` โดยตรง
  - ช่วยลดเวลาในการทดสอบและตัดความขึ้นต่อกัน (Dependency) จากหน้า Login ทำให้สามารถมุ่งเน้นการทดสอบ Component ระดับล่างได้โดยตรง
- **ส่วนที่เป็น Real (ของจริง):**
  - **หน้า Inventory จริง:** หน้าแสดงรายการสินค้าจริงของ SauceDemo (ตรวจสอบรายการสินค้าจริง 6 รายการ)
  - **ฟังก์ชันการทำงานของ Shopping Cart จริง:** การคลิกเพิ่มสินค้าจริง (`Sauce Labs Backpack` และ `Sauce Labs Bike Light`) การอัปเดต Cart Badge จริงเป็น `2` และการเปิดหน้า Cart จริงเพื่อตรวจสอบรายการสินค้าในตะกร้า

---

## 3. รายละเอียด Test Suites ทั้ง 6 ข้อ

### บทที่ 1: Unit Testing / UI Component Testing
- **`tests/unit/UT-01.spec.ts` (Login Form Validation):**
  - `UT-01.1: empty username and password`: ตรวจสอบการแจ้งเตือน `Username is required` เมื่อไม่กรอกข้อมูล
  - `UT-01.2: missing password`: ตรวจสอบการแจ้งเตือน `Password is required` เมื่อกรอกเพียง Username
  - `UT-01.3: invalid login details`: ตรวจสอบการแจ้งเตือนข้อความเมื่อกรอกข้อมูลเข้าสู่ระบบผิดพลาด และทั้ง 3 กรณีต้องไม่เข้าสู่หน้า Inventory
- **`tests/unit/UT-02.spec.ts` (Product Button State Validation):**
  - `UT-02: product button state Add to cart -> Remove -> Add to cart`: ตรวจสอบวงจรสถานะของปุ่มสินค้า Sauce Labs Backpack จาก `Add to cart` -> `Remove` (Cart Badge = 1) -> `Add to cart` (Cart Badge หายไป)

### บทที่ 2: Integration Testing
- **`tests/integration/IT-01.spec.ts` (Top-Down with Stub):**
  - `IT-01: top-down REAL Login -> browser-level Inventory STUB`: ทดสอบ Login จริงร่วมกับ Inventory Stub ที่สร้างผ่าน `page.setContent()`
- **`tests/integration/IT-02.spec.ts` (Bottom-Up with Driver):**
  - `IT-02: DRIVER login state -> REAL Inventory and Cart`: ทดสอบโดยใช้ Driver ฉีด Cookie เปิดหน้า Inventory และทดสอบการทำงานของ Inventory และ Shopping Cart จริง

### บทที่ 3: System Testing
- **`tests/system/ST-01.spec.ts` (Complete Purchase Flow):**
  - `ST-01: complete purchase of two products`: ทดสอบ End-to-End ตั้งแต่ Login -> เลือกสินค้า 2 ชิ้น -> ตรวจสอบตะกร้า -> Checkout -> กรอกข้อมูลลูกค้า -> Overview -> Finish จนกระทั่งได้รับข้อความ `Thank you for your order!`
- **`tests/system/ST-02.spec.ts` (Checkout Validation and Recovery):**
  - `ST-02: checkout validation and recovery`: ตรวจสอบกระบวนการ Validation ในหน้า Checkout ทีละขั้นตอน (First Name -> Last Name -> Postal Code) และกรอกข้อมูลแก้ไขจนสามารถทำรายการสั่งซื้อสำเร็จ

---

## 4. ผลการรันทดสอบจริง (Test Execution Results)

สรุปผลการรันจริงผ่านคำสั่ง `npx playwright test`:
```
Running 8 tests using 1 worker

  ok 1 [chromium] › tests\integration\IT-01.spec.ts:3:5 › IT-01: top-down REAL Login -> browser-level Inventory STUB (959ms)
  ok 2 [chromium] › tests\integration\IT-02.spec.ts:16:5 › IT-02: DRIVER login state -> REAL Inventory and Cart (1.5s)
  ok 3 [chromium] › tests\system\ST-01.spec.ts:3:5 › ST-01: complete purchase of two products (1.1s)
  ok 4 [chromium] › tests\system\ST-02.spec.ts:3:5 › ST-02: checkout validation and recovery (1.2s)
  ok 5 [chromium] › tests\unit\UT-01.spec.ts:5:7 › UT-01: Login Form Validation › UT-01.1: empty username and password (576ms)
  ok 6 [chromium] › tests\unit\UT-01.spec.ts:31:7 › UT-01: Login Form Validation › UT-01.2: missing password (556ms)
  ok 7 [chromium] › tests\unit\UT-01.spec.ts:57:7 › UT-01: Login Form Validation › UT-01.3: invalid login details (600ms)
  ok 8 [chromium] › tests\unit\UT-02.spec.ts:3:5 › UT-02: product button state Add to cart -> Remove -> Add to cart (776ms)

  8 passed (8.3s)
```

- รายงานแบบ HTML จัดเก็บอยู่ที่: `playwright-report/index.html`
- รายงานแบบ JSON จัดเก็บอยู่ที่: `reports/results.json`
- รายงานสรุปผลจัดเก็บอยู่ที่: `reports/test-summary.md`

---

## 5. วิธีการติดตั้งและรันการทดสอบ

### 5.1 การติดตั้ง Dependencies
```bash
# ติดตั้ง dependencies ทั้งหมด
npm install

# ติดตั้งเบราว์เซอร์สำหรับ Playwright (หากยังไม่ได้ติดตั้ง)
npx playwright install chromium
```

### 5.2 คำสั่งรันการทดสอบ
```bash
# รันการทดสอบทั้งหมด
npx playwright test

# เปิดดูรายงาน Playwright HTML Report
npx playwright show-report
```
