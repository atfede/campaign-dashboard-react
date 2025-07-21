import React, { useState } from "react";

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

function calculateDailyMetrics(campaign) {
  const dates = getDateRange(campaign.startDate, campaign.endDate);
  const days = dates.length;
  const dailyClicks = campaign.clicks / days;
  const dailyCost = campaign.cost / days;
  const dailyRevenue = campaign.revenue / days;

  return dates.map((date) => ({
    date: date.toISOString().slice(0, 10),
    clicks: dailyClicks,
    cost: dailyCost,
    revenue: dailyRevenue,
    profit: dailyRevenue - dailyCost,
  }));
}

export default function CampaignTable({ campaigns, deleteCampaign }) {
  const [sortField, setSortField] = useState("name");
  const [expandedCampaign, setExpandedCampaign] = useState(null);

  const sorted = [...campaigns].sort((a, b) => {
    if (sortField === "profit") {
      return b.revenue - b.cost - (a.revenue - a.cost);
    } else if (sortField.includes("Date")) {
      return new Date(a[sortField]) - new Date(b[sortField]);
    } else {
      return a[sortField].localeCompare(b[sortField]);
    }
  });

  return (
    <div>
      <div className="flex gap-4 mb-2">
        <label>Sort by:</label>
        <select onChange={(e) => setSortField(e.target.value)} className="border p-1">
          <option value="name">Name</option>
          <option value="startDate">Start Date</option>
          <option value="endDate">End Date</option>
          <option value="profit">Profit</option>
        </select>
      </div>

      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th>Name</th>
            <th>Start</th>
            <th>End</th>
            <th>Clicks</th>
            <th>Cost</th>
            <th>Revenue</th>
            <th>Profit</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((c, idx) => (
            <React.Fragment key={idx}>
              <tr className="text-center border-t">
                <td>{c.name}</td>
                <td>{c.startDate}</td>
                <td>{c.endDate}</td>
                <td>{c.clicks}</td>
                <td>${c.cost.toFixed(2)}</td>
                <td>${c.revenue.toFixed(2)}</td>
                <td>${(c.revenue - c.cost).toFixed(2)}</td>
                <td className="actions">
                  <button
                    className="bg-red-500 text-white px-2 py-1 rounded mr-2"
                    onClick={() => deleteCampaign(c.name)}
                  >
                    Delete
                  </button>
                  <button
                    className="bg-blue-600 text-white px-2 py-1 rounded"
                    onClick={() =>
                      setExpandedCampaign(expandedCampaign === c.name ? null : c.name)
                    }
                  >
                    {expandedCampaign === c.name ? "Hide Metrics" : "Show Daily Metrics"}
                  </button>
                </td>
              </tr>
              {expandedCampaign === c.name && (
                <tr>
                  <td colSpan="8" style={{ backgroundColor: "#f0f4f8", textAlign: "left" }}>
                    <DailyMetricsTable campaign={c} />
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan="8" className="text-center p-4">
                No campaigns added.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function DailyMetricsTable({ campaign }) {
  const dailyData = calculateDailyMetrics(campaign);

  return (
    <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
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
        {dailyData.map(({ date, clicks, cost, revenue, profit }) => (
          <tr key={date}>
            <td>{date}</td>
            <td>{clicks.toFixed(0)}</td>
            <td>${cost.toFixed(2)}</td>
            <td>${revenue.toFixed(2)}</td>
            <td>${profit.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}