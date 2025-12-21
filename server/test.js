// server/test.js
async function testServer() {
  const response = await fetch("http://localhost:5000/api/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ 
      query: "I need a blue shirt for a beach party under $40" 
    })
  });

  const data = await response.json();
  console.log("Server Response:", data);
}

testServer();