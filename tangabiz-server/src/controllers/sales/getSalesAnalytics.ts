import { Context } from "hono";
import { prisma } from "../../helpers/prisma";

export default async (c: Context) => {
  try {
    const { range, businessId } = c.req.query();

    if (!businessId) {
      return c.json({ error: "Missing businessId" }, 400);
    }

    let salesData: any[] = [];

    const now = new Date();

    if (range === "daily") {
      // Last 24 hours split into 4 periods (6 hours each)
      // Group sales by 6 hour slots in the last 24 hours
      const startDate = new Date(now);
      startDate.setHours(now.getHours() - 24);

      salesData = await prisma.$queryRaw<
        { period: string; total: number }[]
      >`
        SELECT 
          CONCAT(
            FLOOR(EXTRACT(HOUR FROM "createdAt") / 6) * 6,
            '-',
            FLOOR(EXTRACT(HOUR FROM "createdAt") / 6) * 6 + 6
          ) AS period,
          SUM("total") as total
        FROM "Sale"
        WHERE "businessId" = ${businessId}
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${now}
        GROUP BY period
        ORDER BY period
      `;

      // Ensure all 4 periods exist (0-6, 6-12, 12-18, 18-24)
      const allPeriods = ["0-6", "6-12", "12-18", "18-24"];
      const resultsMap = new Map(
        salesData.map(({ period, total }) => [period, total])
      );

      salesData = allPeriods.map((p) => ({
        label: p,
        total: resultsMap.get(p) ?? 0,
      }));
    } else if (range === "weekly") {
      // Last 7 days, group by day (YYYY-MM-DD)
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 6); // 7 days total including today

      salesData = await prisma.$queryRaw<
        { day: string; total: number }[]
      >`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM-DD') AS day,
          SUM("total") as total
        FROM "Sale"
        WHERE "businessId" = ${businessId}
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${now}
        GROUP BY day
        ORDER BY day
      `;

      // Fill missing days with zero total
      const resultsMap = new Map(salesData.map(({ day, total }) => [day, total]));
      salesData = [];

      for (let i = 0; i < 7; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const dayString = date.toISOString().slice(0, 10);
        salesData.push({
          label: dayString,
          total: resultsMap.get(dayString) ?? 0,
        });
      }
    } else if (range === "monthly") {
      // Last 6 months grouped by month name
      const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      salesData = await prisma.$queryRaw<
        { month: string; total: number }[]
      >`
        SELECT 
          TO_CHAR("createdAt", 'Mon YYYY') AS month,
          SUM("total") as total
        FROM "Sale"
        WHERE "businessId" = ${businessId}
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${now}
        GROUP BY month
        ORDER BY TO_DATE(month, 'Mon YYYY')
      `;

      // Fill missing months with zero total
      const resultsMap = new Map(
        salesData.map(({ month, total }) => [month, total])
      );
      salesData = [];

      for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const monthStr = date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });
        salesData.push({
          label: monthStr,
          total: resultsMap.get(monthStr) ?? 0,
        });
      }
    } else {
      return c.json(
        { error: "Invalid range. Allowed values: daily, weekly, monthly." },
        400
      );
    }

    return c.json(salesData);
  } catch (error) {
    console.error("Error fetching sales trend:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
};