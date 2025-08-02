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
      const startDate = new Date(now);
      startDate.setHours(now.getHours() - 24);

      salesData = await prisma.$queryRaw<
        { period: string; count: bigint }[]
      >`
        SELECT 
          CONCAT(
            FLOOR(EXTRACT(HOUR FROM "createdAt") / 6) * 6,
            '-',
            FLOOR(EXTRACT(HOUR FROM "createdAt") / 6) * 6 + 6
          ) AS period,
          COUNT(*) as count
        FROM "Sale"
        WHERE "businessId" = ${businessId}
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${now}
        GROUP BY period
        ORDER BY period
      `;

      const allPeriods = ["0-6", "6-12", "12-18", "18-24"];
      const resultsMap = new Map(
        salesData.map(({ period, count }) => [period, Number(count)])
      );

      salesData = allPeriods.map((p) => ({
        label: p,
        total: resultsMap.get(p) ?? 0,
      }));
    } else if (range === "weekly") {
      const startDate = new Date(now);
      startDate.setDate(now.getDate() - 6);

      salesData = await prisma.$queryRaw<
        { day: string; count: bigint }[]
      >`
        SELECT 
          TO_CHAR("createdAt", 'YYYY-MM-DD') AS day,
          COUNT(*) as count
        FROM "Sale"
        WHERE "businessId" = ${businessId}
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${now}
        GROUP BY day
        ORDER BY day
      `;

      const resultsMap = new Map(
        salesData.map(({ day, count }) => [day, Number(count)])
      );
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
      const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);

      salesData = await prisma.$queryRaw<
        { year: number; month: number; count: bigint }[]
      >`
        SELECT 
          EXTRACT(YEAR FROM "createdAt") AS year,
          EXTRACT(MONTH FROM "createdAt") AS month,
          COUNT(*) as count
        FROM "Sale"
        WHERE "businessId" = ${businessId}
          AND "createdAt" >= ${startDate}
          AND "createdAt" <= ${now}
        GROUP BY year, month
        ORDER BY year, month
      `;

      const resultsMap = new Map(
        salesData.map(({ year, month, count }) => {
          const label = new Date(year, month - 1).toLocaleString("en-US", {
            month: "short",
            year: "numeric",
          });
          return [label, Number(count)];
        })
      );

      salesData = [];
      for (let i = 0; i < 6; i++) {
        const date = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
        const label = date.toLocaleString("en-US", {
          month: "short",
          year: "numeric",
        });

        salesData.push({
          label,
          total: resultsMap.get(label) ?? 0,
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