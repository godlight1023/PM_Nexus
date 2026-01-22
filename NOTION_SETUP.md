# Notion Integration Setup Guide

Follow these steps to connect your PM Nexus workbench to your Notion workspace.

## 1. Create Notion Integration

1. Go to [My Integrations](https://www.notion.so/my-integrations).
2. Click **New integration**.
3. Name it `PM Nexus` (or anything you like).
4. Select the associated workspace.
5. Click **Submit**.
6. **Copy the "Internal Integration Secret"**. You will need this for the `.env.local` file.

## 2. Set Up Notion Database

You need a database with specific properties for the app to read it correctly.

1. Create a new **Database** (Full Page or Inline) in Notion.
2. Set up the following properties (Column Name : Property Type):

| Property Name | Type          | Description |
|---------------|---------------|-------------|
| **Name**      | Title         | The title of your content |
| **Type**      | Select        | Options: `Note`, `Project`, `Thought` |
| **Status**    | Select        | Options: `Public`, `Private` |
| **Date**      | Date          | Creation or publication date |
| **Tags**      | Multi-select  | E.g., `AI`, `Product`, `Design` |
| **Excerpt**   | Text          | A short summary shown in the card |

**Important**: 
- Ensure property names match exactly (case-sensitive).
- Add some dummy data to test.
- Ensure at least one item has Status = `Public`.

## 3. Connect Integration to Database

1. Open your new Database page in Notion.
2. Click the `...` (three dots) menu at the top right of the page.
3. Scroll down to **Connections** > **Connect to**.
4. Search for and select your integration (`PM Nexus`).
5. Confirm access.

## 4. Get Database ID

1. Click `Share` > `Copy link` on the database page.
2. The link will look like this: 
   `https://www.notion.so/myworkspace/a8aec43384f447ed84390e8e42c2e089?v=...`
3. The Database ID is the 32-character part between the slash and the question mark:
   `a8aec43384f447ed84390e8e42c2e089`

## 5. Configure Environment Variables

1. Rename `.env.local.example` to `.env.local` in your project root (if you haven't already).
2. Fill in the values:

```env
NOTION_API_KEY=secret_your_integration_token_here
NOTION_DATABASE_ID=your_database_id_here
```

## 6. Restart Server

Stop and restart your Next.js development server to load the new environment variables:

```bash
npm run dev
```

Your stream should now display content from your Notion database!
