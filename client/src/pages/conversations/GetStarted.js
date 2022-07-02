import { Nav, Row } from "react-bootstrap";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

const GetStarted = ({signOut}) => {
  return (
    <div className="wrapp">
      <Sidebar signOut={signOut} />

      <div className="content">
        <Nav
          class="navbar navbar-expand-lg"
          style={{ height: "8%" }}
        >
          <a class="navbar-brand" href="#">
            GetStarted
          </a>
        </Nav>
        <Row md={8} style={{ display: "flex" }} className="content-row"></Row>
      </div>
    </div>
  );
};

export default GetStarted;
