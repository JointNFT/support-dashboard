import { Col, Nav, Row } from "react-bootstrap";
import { Chat } from "../components/chat/Chat";
import Transaction from "../components/transaction/transaction";

const Home = () => {
  return (
    <div className="content">
      <Nav
        class="navbar navbar-expand-lg navbar-light bg-light"
        style={{ height: "8%" }}
      >
        <a class="navbar-brand" href="#">
          HighFi
        </a>
      </Nav>
      <Row md={7} style={{ display: "flex", width: '80%' }} className="content-row">
        <Col style={{ display: "contents" }}>
          <Chat />
        </Col>
        <Col>
          {" "}
          <Transaction />
        </Col>
      </Row>
    </div>
  );
};

export default Home;
