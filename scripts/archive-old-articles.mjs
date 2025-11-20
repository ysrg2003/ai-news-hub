import mysql from "mysql2/promise";
import fs from "fs/promises";
import path from "path";
import { config } from "dotenv";

config();

/**
 * Archive articles older than specified days
 * Creates monthly archive files for historical data
 */
async function archiveOldArticles(daysOld = 90) {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log(`📦 Starting archive process for articles older than ${daysOld} days...`);

    // Calculate date threshold
    const thresholdDate = new Date();
    thresholdDate.setDate(thresholdDate.getDate() - daysOld);

    // Get articles older than threshold
    const [articles] = await connection.execute(
      `
      SELECT * FROM articles 
      WHERE createdAt < ? 
      ORDER BY createdAt DESC
    `,
      [thresholdDate]
    );

    if (articles.length === 0) {
      console.log("✅ No articles to archive");
      return;
    }

    // Group articles by month
    const archivesByMonth = {};
    articles.forEach((article) => {
      const date = new Date(article.createdAt);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

      if (!archivesByMonth[monthKey]) {
        archivesByMonth[monthKey] = [];
      }
      archivesByMonth[monthKey].push(article);
    });

    // Create archive files
    const archiveDir = path.join(process.cwd(), "archives");
    await fs.mkdir(archiveDir, { recursive: true });

    for (const [month, monthArticles] of Object.entries(archivesByMonth)) {
      const archiveFile = path.join(archiveDir, `archive-${month}.json`);
      await fs.writeFile(archiveFile, JSON.stringify(monthArticles, null, 2));
      console.log(`✅ Created archive: archive-${month}.json (${monthArticles.length} articles)`);
    }

    // Update database to mark articles as archived (optional)
    await connection.execute(
      `
      UPDATE articles 
      SET archived = true 
      WHERE createdAt < ?
    `,
      [thresholdDate]
    );

    console.log(`\n✨ Archive process completed! ${articles.length} articles archived.`);
  } catch (error) {
    console.error("❌ Error during archiving:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

// Run archiving
archiveOldArticles(90);
