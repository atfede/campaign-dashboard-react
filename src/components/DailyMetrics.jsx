import React from "react";

function getDateRange(start, end) {
  const dates = [];
  let current = new Date(start);
  const endDate = new Date(end);
  while (current <= endDate) {
    dates.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }
  return dates;
}

function randomDistribution(total, parts) {
  const values = Array(parts).fill(0);
  let remaining = total;
  for (let i = 0; i < parts - 1; i++) {
    const value = +(Math.random() * remaining * 0.8).toFixed(2);
    values[i] = value;
    remaining -= value;
  }
  values[parts - 1] = +remaining.toFixed(2);
  return values;
}

function simulateDailyData(campaign) {
  const dates = getDateRange(campaign.startDate, campaign.endDate);
  const days = dates.length;

  const clicksDist = randomDistribution(campaign.clicks, days).map(v => Math.round(v));
  const costDist = randomDistribution(campaign.cost, days);
  const revenueDist = randomDistribution(campaign.revenue, days);

  return dates.map((date, i) => ({
    date: date.toISOString().slice(0, 10),
    clicks: clicksDist[i],
    cost: costDist[i],
    revenue: revenueDist[i],
    profit: revenueDist[i] - costDist[i],
  }));
}

export default function DailyMetrics({ campaigns }) {
  let allDatesSet = new Set();
  const dailyDataPerCampaign = campaigns.map(simulateDailyData);
  dailyDataPerCampaign.forEach((dailyData) =>
    dailyData.forEach(({ date }) => allDatesSet.add(date))
  );
  const allDates = Array.from(allDatesSet).sort();

  const aggregatedData = allDates.map((date) => {
    let clicks = 0,
      cost = 0,
      revenue = 0,
      profit = 0;
    dailyDataPerCampaign.forEach((dailyData) => {
      const dayData = dailyData.find((d) => d.date === date);
      if (dayData) {
        clicks += dayData.clicks;
        cost += dayData.cost;
        revenue += dayData.revenue;
        profit += dayData.profit;
      }
    });
    return { date, clicks, cost, revenue, profit };
  });

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>Daily Campaign Performance Metrics</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Date</th>
            <th>Clicks</th>
            <th>Cost</th>
            <th>Revenue</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.map(({ date, clicks, cost, revenue, profit }) => (
            <tr key={date}>
              <td>{date}</td>
              <td>{clicks}</td>
              <td>${cost.toFixed(2)}</td>
              <td>${revenue.toFixed(2)}</td>
              <td>${profit.toFixed(2)}</td>
            </tr>
          ))}
          {aggregatedData.length === 0 && (
            <tr>
              <td colSpan="5">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
