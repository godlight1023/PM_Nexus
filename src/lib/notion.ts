import { Client } from "@notionhq/client";

// Initialize Notion Client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
export const isNotionConnected = !!(process.env.NOTION_API_KEY && NOTION_DATABASE_ID);

export interface NotionPage {
  id: string;
  title: string;
  type: "Note" | "Project" | "Thought";
  date: string;
  status: "Public" | "Private";
  excerpt: string;
  tags: string[];
  url: string;
}

/**
 * Fetch pages from the Notion database.
 * Filters for 'Public' pages by default unless specified otherwise.
 */
export async function getNotionPages(): Promise<NotionPage[]> {
  console.log("Attempting to fetch Notion pages...");
  console.log("API Key present:", !!process.env.NOTION_API_KEY);
  console.log("Database ID:", NOTION_DATABASE_ID);

  if (!process.env.NOTION_API_KEY || !NOTION_DATABASE_ID) {
    console.warn("Notion credentials not found. Returning sample data.");
    return getSampleData();
  }

  try {
    const response = await notion.databases.query({
      database_id: NOTION_DATABASE_ID,
      filter: {
        property: "Status",
        select: {
          equals: "Public",
        },
      },
      sorts: [
        {
          property: "Date",
          direction: "descending",
        },
      ],
    });
    
    console.log("Notion API Response success. Items:", response.results.length);

    return response.results.map((page: any) => {
      const props = page.properties;
      
      // Helper to safely extract property values based on assumptions about DB structure
      // Log parsing errors but don't crash the whole request
      try {
          const title = props.Name?.title?.[0]?.plain_text || "Untitled";
          const type = props.Type?.select?.name || "Note";
          const date = props.Date?.date?.start || new Date().toISOString();
          const status = props.Status?.select?.name || "Private";
          const tags = props.Tags?.multi_select?.map((tag: any) => tag.name) || [];
          const excerpt = props.Excerpt?.rich_text?.[0]?.plain_text || "";
          
          return {
            id: page.id,
            title,
            type,
            date,
            status,
            excerpt,
            tags,
            url: page.url,
          };
      } catch (err) {
          console.error("Error parsing Notion page:", page.id, err);
          return null;
      }
    }).filter(Boolean) as NotionPage[];
  } catch (error) {
    console.error("Failed to fetch Notion pages:", error);
    return getSampleData();
  }
}

function getSampleData(): NotionPage[] {
  return [
    {
      id: "1",
      title: "The Future of AI in Product Management (Sample)",
      type: "Thought",
      date: new Date().toISOString(),
      status: "Public",
      excerpt: "Notion API not connected. This is sample data. Please configure .env.local with NOTION_API_KEY and NOTION_DATABASE_ID.",
      tags: ["AI", "Product", "Sample"],
      url: "#",
    },
    {
      id: "2",
      title: "Project Nexus Architecture (Sample)",
      type: "Project",
      date: new Date(Date.now() - 86400000).toISOString(),
      status: "Private",
      excerpt: "Internal documentation for the new knowledge graph database schema...",
      tags: ["Dev", "Architecture", "Sample"],
      url: "#",
    },
  ];
}
