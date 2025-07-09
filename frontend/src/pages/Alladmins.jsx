import React, { useState } from "react";
import Admin from "./admin/Admin";
import UsersAdmin from "./usersAdmin/UsersAdmin";
import SupportReplies from "../pages/admin/SupportReplies"; // ✅ Əlavə et

const Alladmins = () => {
  const [selectedTab, setSelectedTab] = useState("books");

  return (
    <div className="container mt-5">
      <div style={{ marginTop: "120px" }}></div>
      <div className="row mt-5">
        <div className="col-lg-2 col-md-12">
          <div className="d-flex flex-column gap-2 justidy-content-center align-items-center">
            <h3 className="text-center">Admin Panel</h3>
            <div
              className={`tab-button ${selectedTab === "books" ? "active" : ""}`}
              onClick={() => setSelectedTab("books")}
            >
              Movies
            </div>
             <div
              className={`tab-button ${selectedTab === "support" ? "active" : ""}`}
              onClick={() => setSelectedTab("support")}
            >
              Support Messages
            </div>
            <div
              className={`tab-button ${selectedTab === "users" ? "active" : ""}`}
              onClick={() => setSelectedTab("users")}
            >
              Users
            </div>
          </div>
        </div>

        <div className="tab-content col-lg-10 col-md-12">
          {selectedTab === "books" && <Admin />}
          {selectedTab === "users" && <UsersAdmin />}
          {selectedTab === "support" && <SupportReplies />}
        </div>
      </div>
    </div>
  );
};

export default Alladmins;
