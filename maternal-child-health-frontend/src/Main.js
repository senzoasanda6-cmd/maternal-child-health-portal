import React from "react";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Card from "./components/Card";
import { useNavigate } from "react-router-dom";
import cardConfig from "./config/dashboardCards";
import "./Main.css";

const Main = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const name = user?.name || "Guest";
  const role = user?.role || "Mother";

  const cards = cardConfig[role.toLowerCase()] || [];

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <>
      <Header userName={name} role={role} onLogout={handleLogout} />
      <div className="main-container">
        <Sidebar activePage="Dashboard" role={role} />
        <main className="content">
          <h2>Dashboard</h2>
          {cards.length === 0 ? (
            <p>No dashboard items available for your role.</p>
          ) : (
            <div className="grid-container">
              {cards.map((card, index) => (
                <Card
                  key={index}
                  title={card.title}
                  buttonText={card.buttonText}
                  buttonStyle={card.buttonStyle}
                  onButtonClick={() => navigate(card.path)}
                >
                  <p>{card.description}</p>
                </Card>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Main;
