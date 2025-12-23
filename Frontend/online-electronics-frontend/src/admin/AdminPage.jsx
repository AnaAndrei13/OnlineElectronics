import React from "react";
import { useNavigate } from "react-router-dom";
import '../css/AdminPage.css';

const AdminPage = () => {
    const navigate = useNavigate();

    const adminCards = [
        {
            id: 1,
            title: "Manage Categories",
            description: "Add, edit, and organize product categories",
            icon: "📁",
            path: "/admin/categories",
            color: "#4CAF50"
        },
        {
            id: 2,
            title: "Manage Products",
            description: "Control your product inventory and details",
            icon: "📦",
            path: "/admin/products",
            color: "#2196F3"
        },
        {
            id: 3,
            title: "Manage Orders",
            description: "View and process customer orders",
            icon: "🛒",
            path: "/admin/orders",
            color: "#FF9800"
        }
    ];

    return (
        <div className="admin-page">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <p>Manage your online electronics store</p>
            </div>

            <div className="admin-grid">
                {adminCards.map(card => (
                    <div 
                        key={card.id}
                        className="admin-card"
                        onClick={() => navigate(card.path)}
                        style={{ '--card-color': card.color }}
                    >
                        <div className="card-icon">{card.icon}</div>
                        <h2>{card.title}</h2>
                        <p>{card.description}</p>
                        <div className="card-arrow">→</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default AdminPage;


