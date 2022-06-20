import React from "react";
import Sidebar from '../components/layout/Sidebar/Sidebar'

const Customers = ({signOut}) => {
  return (
    <div className="wrapp">
	<Sidebar signOut={signOut} />
      <div className="customers">
        <h4>Access Keys</h4>
        <p>View all your access keys</p>
        <div className="popular">
          <div className="row">
            <div className="row-head">
              <div className="name column">Organization</div>
              <div className="name column">API Key</div>
            </div>
            <div className="row-body">
              <div className="name column">Company_Name</div>
              <div className="name column">SomeAPIKey</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Customers;
