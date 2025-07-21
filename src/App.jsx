import React, { useEffect, useState } from "react";
import CampaignForm from "./components/CampaignForm";
import CampaignTable from "./components/CampaignTable";

function App() {
  const [campaigns, setCampaigns] = useState(() => {
    const saved = localStorage.getItem("campaigns");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("campaigns", JSON.stringify(campaigns));
  }, [campaigns]);

  const addCampaign = (newCampaign) => {
    setCampaigns([...campaigns, newCampaign]);
  };

  const deleteCampaign = (name) => {
    setCampaigns(campaigns.filter((c) => c.name !== name));
  };

  return (
    <div className="container">
      <h1>Campaign Dashboard</h1>
      <CampaignForm addCampaign={addCampaign} />
      <CampaignTable campaigns={campaigns} deleteCampaign={deleteCampaign} />
    </div>
  );
}

export default App;
