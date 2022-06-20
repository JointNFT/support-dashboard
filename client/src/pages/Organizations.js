import { Link } from "react-router-dom";
import ModalForm from "../ui/Modal";

const Organizations = () => {
  return (
    <div className="organizations">
      <h3>Organizations</h3>
      <div className="row-center">
        <Link to="/conversations/all" className="org-card">
          <img src="./image.jpg" alt="" />
          <h4>HighFi</h4>
        </Link>
        <Link to="/conversations/all" className="org-card">
          <img src="./image.jpg" alt="" />
          <h4>HighFi</h4>
        </Link>
        <Link to="/conversations/all" className="org-card">
          <img src="./image.jpg" alt="" />
          <h4>HighFi</h4>
        </Link>
        <Link to="/conversations/all" className="org-card">
          <img src="./image.jpg" alt="" />
          <h4>HighFi</h4>
        </Link>
        <Link to="/conversations/all" className="org-card">
          <img src="./image.jpg" alt="" />
          <h4>HighFi</h4>
        </Link>
        <button className="custom-btn">
          <ModalForm />
        </button>
      </div>
    </div>
  );
};

export default Organizations;
