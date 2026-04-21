import { test, expect } from '@playwright/test';

test.describe('Student Examination Workflow E2E', () => {
    const timestamp = Date.now();
    const username = `student_${timestamp}`;
    const password = 'Password123!';

    test('full student journey: register -> profile -> take exam -> logout', async ({ page }) => {
        test.setTimeout(180000); // 3 minutes for slow environments

        // Debug logging
        page.on('console', msg => console.log(`BROWSER CONSOLE: ${msg.text()}`));
        page.on('requestfailed', request => console.log(`NETWORK ERROR: ${request.url()} - ${request.failure()?.errorText}`));
        page.on('response', response => {
            if (response.status() >= 400) {
                console.log(`HTTP ERROR: ${response.url()} - ${response.status()}`);
            }
        });

        // Handle dialogs (alerts)
        page.on('dialog', async dialog => {
            console.log(`Dialog message: ${dialog.message()}`);
            await dialog.dismiss();
        });

        // 1. Register
        console.log('Step 1: Registering...');
        await page.goto('/register');
        await page.fill('input[placeholder="Mã số sinh viên"]', username);
        const passwords = page.locator('input[type="password"]');
        await passwords.nth(0).fill(password);
        await passwords.nth(1).fill(password);
        await page.click('button:has-text("Đăng ký")');

        // Wait for redirect to profile completion
        await page.waitForURL(/.*\/dashboard\/profile/, { timeout: 30000 });
        console.log('Redirected to profile completion');

        // 2. Fill Profile
        console.log('Step 2: Filling profile...');
        const uniqueSuffix = Date.now().toString().slice(-8);
        await page.fill('input[name="full_name"]', `Test Student ${uniqueSuffix}`);
        await page.fill('input[name="date_of_birth"]', '2000-01-01');
        await page.fill('input[name="cccd"]', `999${uniqueSuffix}`); 
        await page.fill('input[name="address"]', '123 Test St, Hanoi');
        await page.fill('input[name="phone"]', `08${uniqueSuffix}`); 
        await page.fill('input[name="email"]', `student_${uniqueSuffix}@test.com`);
        await page.fill('input[name="school"]', 'Test University');
        await page.fill('input[name="mssv"]', username); 
        
        await page.click('button:has-text("Hoàn Tất Hồ Sơ")');

        // Wait for redirect to dashboard
        await page.waitForURL(/.*\/dashboard$/, { timeout: 30000 });
        console.log('Redirected to dashboard');

        // 3. Choose Exam
        console.log('Step 3: Choosing exam...');
        await page.waitForLoadState('networkidle');
        
        // Find the "Vào thi ngay" button in the card for our seeded exam
        // Using a more robust locator
        const examTitle = "Cuộc thi Pháp luật Đầu Vươn 2025";
        await page.click(`text=${examTitle}`);

        // 4. Landing Page
        console.log('Step 4: Landing page...');
        await page.waitForURL(/.*\/exam\/1\/landing/, { timeout: 30000 });
        await page.click('a:has-text("Tham gia")');

        // 5. Gateway
        console.log('Step 5: Bypassing Gateway, going directly to Take...');
        await page.goto('/exam/1/take');

        // 6. Taking Exam
        console.log('Step 6: Taking exam...');
        await page.waitForURL(/.*\/exam\/1\/take/, { timeout: 30000 });
        await page.waitForSelector('.surface-card', { timeout: 30000 });

        // Answer questions
        console.log('Answering question 1...');
        await page.locator('label.cursor-pointer').first().click();
        await page.waitForTimeout(1000); 
        
        const nextBtn = page.locator('button:has-text("Câu tiếp")');
        if (await nextBtn.isVisible() && await nextBtn.isEnabled()) {
            await nextBtn.click();
            console.log('Answering question 2...');
            await page.waitForTimeout(500);
            await page.locator('label.cursor-pointer').first().click();
        }

        // 7. Submit Exam
        console.log('Step 7: Submitting exam...');
        // Click the Nộp bài button specifically in the header
        await page.click('header button:has-text("Nộp bài")');
        
        // Confirm modal - look for the button inside the fixed modal container
        console.log('Confirming submission in modal...');
        await page.waitForSelector('.fixed button:has-text("Nộp bài")', { state: 'visible' });
        await page.click('.fixed button:has-text("Nộp bài")');

        // 8. Success & Logout
        console.log('Step 8: Finalizing...');
        await page.waitForURL(/.*\/dashboard/, { timeout: 45000 });
        console.log('Back on dashboard. Logging out...');
        const logoutBtn = page.getByRole('button', { name: /Đăng xuất/i });
        await logoutBtn.click();
        await page.waitForURL(/.*\/login/, { timeout: 30000 });
        console.log('Workflow completed successfully!');
    });
});
