import { test, expect } from '@playwright/test';

test.describe('Admin Management Workflow E2E', () => {
    const timestamp = Date.now();
    const adminUsername = `admin_${timestamp}`;
    const password = 'AdminPassword123!';

    test('full admin journey: register -> login -> create org -> create exam -> logout', async ({ page }) => {
        test.setTimeout(120000);

        // Debug logging
        page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));

        // 2. Login as Admin
        console.log('Step 2: Logging in as Admin...');
        await page.goto('/login');
        await page.waitForURL('/login');
        
        // Select Role: Admin
        console.log('Selecting Admin role...');
        const adminTab = page.locator('button:has-text("Quản trị viên")');
        await adminTab.click();
        console.log('Admin role selected');
        
        // Wait for role-specific UI updates
        await page.waitForTimeout(1000);
        
        console.log('Filling credentials...');
        const usernameInput = page.locator('input[type="text"]');
        const passwordInput = page.locator('input[type="password"]');
        
        await usernameInput.waitFor({ state: 'visible' });
        await usernameInput.fill('admin_test');
        await passwordInput.fill('AdminPassword123!');
        
        console.log('Clicking login button...');
        await page.click('button[type="submit"]');

        // Wait for redirect to admin dashboard
        console.log('Waiting for navigation to /admin...');
        await page.waitForURL(/.*\/admin/, { timeout: 30000 });
        console.log('Login successful, on Admin Dashboard');

        // Verify we are actually seeing admin elements
        await page.waitForSelector('text=Tất cả', { timeout: 10000 });
        console.log('Admin dashboard elements detected.');

        // 3. Create Organizational Unit
        console.log('Step 3: Creating Organizational Unit...');
        await page.goto('/admin/organizations');
        await page.waitForSelector('button:has-text("Tạo đơn vị mới")', { timeout: 15000 });
        await page.click('button:has-text("Tạo đơn vị mới")');
        await page.fill('input[name="name"]', `Test Org ${timestamp}`);
        await page.fill('textarea[name="description"]', 'Description for test org');
        // The save button might also be different
        await page.click('button:has-text("Lưu"), button:has-text("Xác nhận")');
        console.log('Organizational Unit created');

        // 4. Create Exam
        console.log('Step 4: Creating Exam...');
        await page.goto('/admin/exams');
        // The exam page uses t("admin.exams.createNew")
        await page.waitForSelector('a:has-text("Tạo"), button:has-text("Tạo")', { timeout: 15000 });
        await page.click('a:has-text("Tạo"), button:has-text("Tạo")');
        
        await page.waitForSelector('input[type="text"]', { timeout: 10000 });
        // The first text input is the title
        await page.locator('input[type="text"]').first().fill(`Test Exam ${timestamp}`);
        await page.locator('input[type="number"]').fill('60');
        
        // Add a question to enable publish button
        console.log('Adding a question...');
        await page.click('button:has-text("Thêm câu hỏi")');
        await page.waitForSelector('textarea', { timeout: 10000 });
        await page.locator('textarea').first().fill('Câu hỏi thử nghiệm: 1 + 1 = ?');
        
        // For multiple choice, fill option A and B
        const options = page.locator('input[placeholder*="Đáp án"], input[placeholder*="Option"]');
        if (await options.count() >= 2) {
            await options.nth(0).fill('2');
            await options.nth(1).fill('3');
        } else {
            // Short answer
            await page.locator('input[type="text"]').last().fill('2');
        }

        console.log('Publishing exam...');
        await page.click('button[type="submit"]');
        
        // Wait for redirect back to exams list
        await page.waitForURL(/.*\/admin\/exams/, { timeout: 30000 });
        console.log('Exam created and published');

        // 5. Logout
        console.log('Step 5: Logging out...');
        await page.click('button:has-text("Đăng xuất"), button:has-text("Logout")');
        await page.waitForURL(/.*\/login/, { timeout: 30000 });
        console.log('Admin workflow completed successfully!');
    });
});
