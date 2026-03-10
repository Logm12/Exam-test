const API_URL = "http://127.0.0.1:8000/api/v1";

async function testFetch() {
    console.log("Logging in...");
    const loginRes = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            username: "student",
            password: "password123", /* using credentials seeded in changelog */
        })
    });

    if (!loginRes.ok) {
        console.error("Login failed:", await loginRes.text());
        return;
    }

    const tokenData = await loginRes.json();
    console.log("Logged in! Token obtained.");

    console.log("Fetching /exams/me...");
    const examsRes = await fetch(`${API_URL}/exams/me`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${tokenData.access_token}` }
    });

    const status = examsRes.status;
    const bodyText = await examsRes.text();
    console.log(`Status: ${status}`);
    console.log(`Response Body:`);
    console.log(bodyText);
}

testFetch().catch(console.error);
