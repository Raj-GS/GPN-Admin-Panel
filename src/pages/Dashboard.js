import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
const summaryData = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12% from last month",
    icon: "👥",
    column: 'totalUsers'
  },
  {
    title: "Organizations",
    value: "2,341",
    change: "+8% from last month",
    icon: "🏢",
    column: 'totalOrganizations'
  },
  {
    title: "Active Prayers",
    value: "8,492",
    change: "+23% from last month",
    icon: "🙏",
    column: 'approvedPrayers'
  },
  {
    title: "Pending Approvals",
    value: "127",
    change: "Needs attention",
    icon: "⏰",
    column: 'pendingPrayers'
  },
];

const quickActions = [
  { label: "Add New Prayer", icon: "➕" },
  { label: "Review Prayers", icon: "✔️" },
  { label: "System Settings", icon: "⚙️" },
];


const Dashboard = () => {
  const [selectedRange, setSelectedRange] = useState("Last 7 days");
  const [page, setPage] = useState(3);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dashboardCounts, setDashboardCounts] = useState([]);
  const [recentActivities1, setRecentActivities1] = useState(null);
  const { user } = useUser();
const API_URL = process.env.REACT_APP_API_URL;


  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      setError('');
      try {
        const token = localStorage.getItem('token');
        const res = await fetch(`${API_URL}dashboard-counts`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) {
          setError(data.message || 'Failed to load profile');
        } else {

          setDashboardCounts(data.data.counts);
          setRecentActivities1(data.data.recent);
        }
      } catch (err) {
        setError('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);
  
  const filteredSummaryData = summaryData.filter(item => {
    if (item.column === 'totalOrganizations') {
      return user?.role === 1; // Only show for role 1
    }
    return true; // Show all other cards
  });

  dayjs.extend(relativeTime);


// After fetching your API data:
const recentPrayers = recentActivities1?.recentPrayers || [];
const recentTestimonies = recentActivities1?.recentTestimonies || [];
const recentSpecialPrayerSubscriptions = recentActivities1?.recentSpecialPrayerSubscriptions || [];

const recentActivities = [
  ...recentPrayers.map(item => ({
    user: `${item.app_users.first_name} ${item.app_users.last_name}`,
    action: `submitted a prayer request: "${item.title}"`,
    time: dayjs(item.created_at).fromNow(), // or use your own formatting
    type: "Prayer",
  })),
  ...recentTestimonies.map(item => ({
    user: `${item.app_users.first_name} ${item.app_users.last_name}`,
    action: `shared a testimony: "${item.title}"`,
    time: dayjs(item.created_at).fromNow(),
    type: "Testimony",
  })),
  ...recentSpecialPrayerSubscriptions.map(item => ({
    user: `${item.app_users.first_name} ${item.app_users.last_name}`,
    action: `subscribed to special prayer: "${item.session_prayers.title}"`,
    time: dayjs(item.created_at).fromNow(),
    type: "Special Subscription",
  })),
].sort((a, b) => new Date(b.time) - new Date(a.time)); // Optional: sort by time


  return (
    <div className="dashboard-content" style={{ padding: 24 }}>
      {/* Summary Cards */}
      <div className="summary-cards" style={{ display: "flex", gap: 24, marginBottom: 24 }}>
        {filteredSummaryData.map((item) => (
          <div
            key={item.title}
            className="card"
            style={{
              flex: 1,
              background: "#fff",
              borderRadius: 12,
              padding: 24,
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontSize: 14, color: "#888" }}>{item.title}</div>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{dashboardCounts?.[item.column] ?? 0}</div>
            <div style={{ fontSize: 14, color: "#4caf50" }}>{item.change}</div>
            <div style={{ fontSize: 28, marginLeft: "auto", marginTop: -32 }}>{item.icon}</div>
          </div>
        ))}
      </div>

      {/* Main Content */}
      <div style={{ display: "flex", gap: 24 }}>
        {/* User Growth Chart */}
        <div style={{ flex: 2, background: "#fff", borderRadius: 12, padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h3>User Growth</h3>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              style={{ padding: 6, borderRadius: 6 }}
            >
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last year</option>
            </select>
          </div>
          <div
            style={{
              height: 180,
              background: "#f5f5f5",
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
              marginTop: 24,
            }}
          >
            Chart visualization would appear here
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ flex: 1, background: "#fff", borderRadius: 12, padding: 24 }}>
          <h3>Quick Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {quickActions.map((action) => (
              <button
                key={action.label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "10px 16px",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  background: "#fafbfc",
                  cursor: "pointer",
                  fontSize: 16,
                }}
              >
                <span>{action.icon}</span>
                {action.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ background: "#fff", borderRadius: 12, padding: 24, marginTop: 24 }}>
        <h3>Recent Activity</h3>
        <div>
        {recentActivities.map((activity, idx) => (
  <div
    key={idx}
    style={{
      display: "flex",
      alignItems: "center",
      borderBottom: idx < recentActivities.length - 1 ? "1px solid #f0f0f0" : "none",
      padding: "12px 0",
    }}
  >
    <div style={{ fontSize: 32, marginRight: 16 }}>👤</div>
    <div style={{ flex: 1 }}>
      <div>
        <strong>{activity.user}</strong> {activity.action}
      </div>
      <div style={{ fontSize: 12, color: "#888" }}>{activity.time}</div>
    </div>
    <div
      style={{
        background: "#f0f0f0",
        borderRadius: 12,
        padding: "2px 12px",
        fontSize: 12,
        marginLeft: 8,
      }}
    >
      {activity.type}
    </div>
  </div>
))}
        </div>
        {/* Pagination */}
        {/* <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: 16 }}>
          <button style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>{"<"}</button>
          <span style={{ margin: "0 12px" }}>3 / 5</span>
          <button style={{ border: "none", background: "none", fontSize: 20, cursor: "pointer" }}>{">"}</button>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;