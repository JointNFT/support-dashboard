import { Col, Nav, Row } from "react-bootstrap";
import { Chat } from "../../components/chat/Chat";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Transaction from "../../components/transaction/transaction";

const All = ({ signOut }) => {
  return (
    <div className="wrapp">
      <Sidebar signOut={signOut} />

      <div className="content">
        <Nav
          class="navbar navbar-expand-lg navbar-light bg-light"
          style={{ height: "8%" }}
        >
          <a class="navbar-brand" href="#">
            All Conversations
          </a>
        </Nav>
        <Row md={8} style={{ display: "flex" }} className="content-row">
          <Col style={{ display: "contents" }}>
            <Chat type="all" />
          </Col>
          <Col>
            {" "}
            <Transaction />
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default All;
