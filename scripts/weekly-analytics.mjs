import mysql from "mysql2/promise";
import { config } from "dotenv";

config();

/**
 * Generate weekly analytics report
 * Analyzes article performance, trends, and engagement
 */
async function generateWeeklyAnalytics() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  try {
    console.log("📊 Generating weekly analytics report...\n");

    // Get articles from past week
    const [weeklyArticles] = await connection.execute(`
      SELECT 
        COUNT(*) as total_articles,
        SUM(CASE WHEN articleType = 'trending' THEN 1 ELSE 0 END) as trending_count,
        SUM(CASE WHEN articleType = 'evergreen' THEN 1 ELSE 0 END) as evergreen_count,
        AVG(readTime) as avg_read_time
      FROM articles 
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
    `);

    // Get articles by category
    const [categoryStats] = await connection.execute(`
      SELECT 
        c.name,
        COUNT(a.id) as article_count,
        AVG(a.readTime) as avg_read_time
      FROM categories c
      LEFT JOIN articles a ON c.id = a.categoryId
      WHERE a.createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY c.id, c.name
      ORDER BY article_count DESC
    `);

    // Get top performing articles
    const [topArticles] = await connection.execute(`
      SELECT 
        title,
        category,
        articleType,
        readTime,
        createdAt
      FROM articles 
      WHERE createdAt >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      ORDER BY createdAt DESC
      LIMIT 10
    `);

    // Generate report
    const report = {
      timestamp: new Date().toISOString(),
      period: "Last 7 Days",
      summary: {
        totalArticles: weeklyArticles[0].total_articles,
        trendingArticles: weeklyArticles[0].trending_count,
        evergreenArticles: weeklyArticles[0].evergreen_count,
        averageReadTime: parseFloat(weeklyArticles[0].avg_read_time).toFixed(2),
      },
      categoryPerformance: categoryStats.map((cat) => ({
        category: cat.name,
        articles: cat.article_count,
        avgReadTime: parseFloat(cat.avg_read_time || 0).toFixed(2),
      })),
      topArticles: topArticles.map((article) => ({
        title: article.title,
        category: article.category,
        type: article.articleType,
        readTime: article.readTime,
        published: article.createdAt,
      })),
      insights: generateInsights(weeklyArticles[0], categoryStats),
    };

    // Print report
    console.log("═══════════════════════════════════════════════════════");
    console.log("           WEEKLY ANALYTICS REPORT");
    console.log("═══════════════════════════════════════════════════════\n");

    console.log("📈 SUMMARY");
    console.log(`   Total Articles: ${report.summary.totalArticles}`);
    console.log(`   Trending: ${report.summary.trendingArticles}`);
    console.log(`   Evergreen: ${report.summary.evergreenArticles}`);
    console.log(`   Avg Read Time: ${report.summary.averageReadTime} min\n`);

    console.log("📂 CATEGORY PERFORMANCE");
    report.categoryPerformance.forEach((cat) => {
      console.log(`   ${cat.category}: ${cat.articles} articles (${cat.avgReadTime} min avg)`);
    });

    console.log("\n🔝 TOP ARTICLES");
    report.topArticles.slice(0, 5).forEach((article, i) => {
      console.log(`   ${i + 1}. ${article.title} (${article.type})`);
    });

    console.log("\n💡 INSIGHTS");
    report.insights.forEach((insight) => {
      console.log(`   • ${insight}`);
    });

    console.log("\n═══════════════════════════════════════════════════════\n");

    return report;
  } catch (error) {
    console.error("❌ Error generating analytics:", error);
    process.exit(1);
  } finally {
    await connection.end();
  }
}

/**
 * Generate insights from analytics data
 */
function generateInsights(summary, categoryStats) {
  const insights = [];

  if (summary.total_articles === 0) {
    insights.push("No articles published this week");
  } else {
    insights.push(`${summary.total_articles} articles published this week`);

    const trendingPercentage = (
      (summary.trending_count / summary.total_articles) *
      100
    ).toFixed(0);
    insights.push(`${trendingPercentage}% of articles are trending content`);

    const topCategory = categoryStats[0];
    if (topCategory && topCategory.article_count > 0) {
      insights.push(`${topCategory.name} is the most active category`);
    }

    if (summary.avg_read_time > 7) {
      insights.push("Average read time is above 7 minutes - consider shorter articles");
    } else if (summary.avg_read_time < 4) {
      insights.push("Average read time is below 4 minutes - consider more in-depth content");
    }
  }

  return insights;
}

// Run analytics
generateWeeklyAnalytics();
