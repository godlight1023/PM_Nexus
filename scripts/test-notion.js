const { Client } = require("@notionhq/client");
const fs = require("fs");
const path = require("path");

// 1. Manually load .env.local
const envPath = path.resolve(__dirname, "../.env.local");
let NOTION_API_KEY = "";
let NOTION_DATABASE_ID = "";

try {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach((line) => {
    const [key, value] = line.split("=");
    if (key && value) {
      if (key.trim() === "NOTION_API_KEY") NOTION_API_KEY = value.trim();
      if (key.trim() === "NOTION_DATABASE_ID") NOTION_DATABASE_ID = value.trim();
    }
  });
} catch (e) {
  console.error("Error reading .env.local:", e.message);
  process.exit(1);
}

console.log("--- Notion Connection Diagnostics ---");
console.log(`API Key found: ${NOTION_API_KEY ? "Yes (" + NOTION_API_KEY.slice(0, 4) + "***)" : "No"}`);
console.log(`Database ID: ${NOTION_DATABASE_ID}`);

if (!NOTION_API_KEY || !NOTION_DATABASE_ID) {
  console.error("Missing credentials in .env.local");
  process.exit(1);
}

// 2. Initialize Client
const notion = new Client({ auth: NOTION_API_KEY });

// 3. Test Connection
async function testConnection() {
  try {
    console.log("\n--- Checking Bot Identity ---");
    const botUser = await notion.users.me({});
    console.log(`🤖 Bot Name: "${botUser.name}"`);
    console.log(`   Bot ID:   ${botUser.id}`);
    console.log("   (Please ensure THIS specific bot is added to your Notion page connections)");

    console.log("\n--- Checking Database Access ---");
    console.log("Attempting to retrieve database metadata...");
    const db = await notion.databases.retrieve({ database_id: NOTION_DATABASE_ID });
    console.log("✅ Success! Connected to database:");
    console.log(`   Name: ${db.title[0]?.plain_text || "Untitled"}`);
    console.log(`   URL: ${db.url}`);
    
    console.log("\nAttempting to query (fetch) items...");
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      page_size: 1,
    });
    console.log(`✅ Query successful! Found ${response.results.length} items.`);
    
    if (response.results.length > 0) {
      const page = response.results[0];
      console.log("\nFirst item properties keys (Check these against your schema):");
      console.log(JSON.stringify(Object.keys(page.properties), null, 2));
    } else {
      console.log("⚠️ Database is empty or no items match the filter.");
    }

  } catch (error) {
    console.error("\n❌ Connection Failed!");
    console.error(`Error Code: ${error.code}`);
    console.error(`Message: ${error.message}`);
    
    if (error.code === "object_not_found") {
      console.log("\n💡 Potential Solution:");
      console.log("1. Go to your Notion Database page.");
      console.log("2. Click the '...' menu in the top right.");
      console.log("3. Scroll to 'Connections' -> 'Connect to'.");
      console.log("4. Select your integration ('PM Nexus' or whatever you named it).");
      console.log("   (Just having the ID is not enough; you must explicitly invite the bot!)");
    } else if (error.code === "unauthorized") {
      console.log("\n💡 Potential Solution:");
      console.log("Check if your Internal Integration Secret is correct.");
    }

    console.log("\n--- fallback: Listing ALL accessible databases ---");
    try {
      const searchRes = await notion.search({
        filter: { value: 'database', property: 'object' }
      });
      if (searchRes.results.length === 0) {
        console.log("❌ The bot has NO access to any databases.");
        console.log("   Please go to Notion and Connect 'My Personal Website' to your page.");
      } else {
        console.log(`✅ Found ${searchRes.results.length} accessible databases:`);
        searchRes.results.forEach(db => {
          console.log(`   - Name: "${db.title[0]?.plain_text || "Untitled"}"`);
          console.log(`     ID:   ${db.id.replace(/-/g, "")}`);
          console.log(`     URL:  ${db.url}`);
        });
        console.log("\n👉 Check if the ID above matches your .env.local ID!");
      }
    } catch (searchErr) {
      console.error("Search failed:", searchErr.message);
    }
  }
}

testConnection();
