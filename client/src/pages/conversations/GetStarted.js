import { Col, Nav, Row } from "react-bootstrap";
import { Chat } from "../../components/chat/Chat";
import Transaction from "../../components/transaction/transaction";

const GetStarted = () => {
  return (
    <div className="content">
      <Nav
        class="navbar navbar-expand-lg navbar-light bg-light"
        style={{ height: "8%" }}
      >
        <a class="navbar-brand" href="#">
        GetStarted
        </a>
      </Nav>
      <Row md={8} style={{ display: "flex" }} className="content-row">
        
      </Row>
    </div>
  );
};

export default GetStarted;
