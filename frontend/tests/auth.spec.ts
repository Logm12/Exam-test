import { test, expect } from '@playwright/test';

test.describe('Authentication Middleware E2E', () => {
    test('unauthorized users are redirected to login from /admin', async ({ page }) => {
        // Navigate to the protected admin route
        const response = await page.goto('/admin');

        // Assert no 500 Server Error is thrown (verifying Next.js Turbopack middleware fix)
        expect(response?.status()).not.toBe(500);

        // Formally verify the user was successfully redirected to the login page via NextAuth
        await expect(page).toHaveURL(/.*\/login\?error=(AccessDenied|Configuration).*/);

        // Check that we see a logical UI rendering a login page, not a stack trace
        await expect(page.locator('text=Sign in to your account')).toBeVisible();
    });
});
