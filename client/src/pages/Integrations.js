import { Component } from "react";

export default class Integrations extends Component {
  render() {
    return (
      <div className="integrations">
        <h4>Integrations</h4>
        <p>Connect with our apps</p>

        <div className="popular">
          <h4>Popular</h4>
          <div className="row">
            <div className="row-head">
              <div className="name">Name</div>
              <div className="status">Status</div>
              <div className="connected">Connected Since</div>
            </div>
            <div className="row-body">
              <div className="name">
                <div className="img">
                  <img src="./discord-icon.svg" alt="discord" width={30} />
                  <small
                    className="ms-2 text-secondary"
                    style={{ fontWeight: "bold" }}
                  >
                    Discord
                  </small>
                </div>
                <p style={{ fontSize: "12px", color: "#aaa" }}>
                  Chat with users via your website
                </p>
              </div>
              <div className="status">
                <button>Not Connected</button>
              </div>
              <div className="connected">
                <div className="span">--</div>
                <span>Add</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
