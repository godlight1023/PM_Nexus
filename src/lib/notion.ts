import { Client } from "@notionhq/client";
import { unstable_cache } from "next/cache";

// Initialize Notion Client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
});

export const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;
export const isNotionConnected = () => !!(process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID);

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
 * Fetch pages from the Notion database with caching.
 * Revalidates every 60 seconds.
 */
export const getNotionPages = unstable_cache(
  async (): Promise<NotionPage[]> => {
    const databaseId = process.env.NOTION_DATABASE_ID;
    console.log("Fetching Notion pages from API...");

    if (!process.env.NOTION_API_KEY || !databaseId) {
      console.warn("Notion credentials not found. Returning sample data.");
      return getSampleData();
    }

    try {
      const response = await notion.databases.query({
        database_id: databaseId,
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
      
      return response.results.map((page: any) => {
        const props = page.properties;
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
      }).filter((item): item is NotionPage => item !== null);
    } catch (error) {
      console.error("Failed to fetch Notion pages:", error);
      return getSampleData();
    }
  },
  ['notion-pages'],
  { revalidate: 60, tags: ['notion'] }
);

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
