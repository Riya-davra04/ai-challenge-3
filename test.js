import fetch from "node-fetch";

async function runTest() {
  try {
    const res = await fetch("http://localhost:3000/health");
    const data = await res.json();

    if (data.status === "OK") {
      console.log("✅ Health Test Passed");
    }

    const res2 = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ q: "I travel 10 km daily" })
    });

    const text = await res2.text();

    if (text.length > 20) {
      console.log("✅ AI Test Passed");
    }

  } catch (err) {
    console.log("❌ Test Failed", err);
  }
}

runTest();