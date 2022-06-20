import React from "react";
import { FaSearch } from "react-icons/fa";

const Customers = () => {
  return (
    <div className="customers">
      <h4>Customers</h4>
      <p>
        View the people that have interacted with you most recently and have
        provided an email address.
      </p>
      <div className="popular">
        <div className="row">
          <div className="search-row">
            <div class="search-box" style={{ border: "1px solid #eee" }}>
              <input
                type="text"
                class="search-input"
                placeholder="Search customers.."
              />

              <button class="search-button" style={{ border: "none" }}>
                <FaSearch color="#aaa" size={15} style={{ width: "30px" }} />
              </button>
            </div>
            <div class="search-box" style={{ border: "1px solid #eee" }}>
              <input
                type="text"
                class="search-input"
                placeholder="Search customers.."
              />

              <button class="search-button" style={{ border: "none" }}>
                <FaSearch color="#aaa" size={15} style={{ width: "30px" }} />
              </button>
            </div>
            <div class="check-box d-flex align-items-center">
              <label
                htmlFor="checkbox"
                style={{
                  fontSize: "12px",
                  display: "flex",
                  alignItems: "center",
                  width: '100%',
                  gap: '10px'
                }}
              >
                <input type="checkbox" id={'checkbox'} />
                <span style={{width: '80%'}}> Include anonymus</span>
              </label>
            </div>

            <div class="search-btn" style={{ border: "1px solid #eee" }}>
              <button class="button" style={{ border: "none" }}>
                <FaSearch color="#fff" size={15} style={{ width: "30px" }} />
                New Customer
              </button>
            </div>
          </div>
          <div className="row-head">
            <div className="email column">Email</div>
            <div className="name column">Name</div>
            <div className="status column">Last Seen</div>
            <div className="connected column">Last Conversation Activity</div>
          </div>
          <div className="row-body">
            <div className="cont mx-auto p-5" style={{ color: '#aaa' }}>
                No Data
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
