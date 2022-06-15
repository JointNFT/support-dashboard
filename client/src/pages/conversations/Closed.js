import React, { Component } from "react";
import { Col, Nav, Row } from "react-bootstrap";
import { Chat } from "../../components/chat/Chat";
import Transaction from "../../components/transaction/transaction";

export default class Closed extends Component {
  render() {
    return (
      <div className="content">
        <Nav
          class="navbar navbar-expand-lg navbar-light bg-light"
          style={{ height: "8%" }}
        >
          <a class="navbar-brand" href="#">
            Closed
          </a>
        </Nav>
        <Row md={8} style={{ display: "flex" }} className="content-row">
          <Col style={{ display: "contents" }}>
            <Chat type="closed"/>
          </Col>
          <Col>
            {" "}
            <Transaction />
          </Col>
        </Row>
      </div>
    );
  }
}
