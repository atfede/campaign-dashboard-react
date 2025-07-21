import React, { useState } from "react";

export default function CampaignForm({ addCampaign }) {
  const [form, setForm] = useState({
    name: "",
    startDate: "",
    endDate: "",
    clicks: "",
    cost: "",
    revenue: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "clicks" || name === "cost" || name === "revenue") {
      setForm({
        ...form,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name) return;

    const campaignToAdd = {
      ...form,
      clicks: form.clicks === "" ? 0 : form.clicks,
      cost: form.cost === "" ? 0 : form.cost,
      revenue: form.revenue === "" ? 0 : form.revenue,
    };

    addCampaign(campaignToAdd);

    setForm({ name: "", startDate: "", endDate: "", clicks: "", cost: "", revenue: "" });
  };

  const fields = [
    { name: "name", type: "text", placeholder: "Enter campaign name", required: true },
    { name: "startDate", type: "date", placeholder: "Start date", required: true },
    { name: "endDate", type: "date", placeholder: "End date", required: true },
    { name: "clicks", type: "number", placeholder: "Clicks", required: false, min: 0 },
    { name: "cost", type: "number", placeholder: "Cost (USD)", required: false, min: 0, step: "0.01" },
    { name: "revenue", type: "number", placeholder: "Revenue (USD)", required: false, min: 0, step: "0.01" },
  ];

  return (
    <form onSubmit={handleSubmit} className="campaign-form">
      {fields.map(({ name, type, placeholder, required, min, step }) => (
        <input
          key={name}
          name={name}
          type={type}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          min={min}
          step={step}
        />
      ))}
      <button type="submit">Add Campaign</button>
    </form>
  );
}
