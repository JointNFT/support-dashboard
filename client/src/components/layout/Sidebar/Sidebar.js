import { AiOutlineMail, AiFillSmile, AiOutlineLogout, AiOutlinePlus, AiOutlineForm } from "react-icons/ai";
import { TbPlugConnected } from "react-icons/tb";
import { FiSettings, FiUsers, FiKey } from "react-icons/fi";
import { TbWorld } from "react-icons/tb";
import { useState } from "react";
import { IoIosArrowUp, IoIosArrowDown } from "react-icons/io";
import "./sidebar.scss";
import { Link } from "react-router-dom";

const Sidebar = (props) => {
  const [activeLink, setActiveLink] = useState(0);
  const [sublink, setSublink] = useState(1);
  const [conversationTab, setConversationTab] = useState(true);
  const [inboxesTab, setInboxesTab] = useState(false);

  const handleClick = (e) => {
    setActiveLink(e.target.tabIndex);
    setSublink(1);
  };

  const onSetSublink = (e) => {
    setSublink(e.target.tabIndex);
  };

  return (
    <div className="sidebar">
      <div className="small">
        <div className="top">
          <Link
            to="/"
            className={`link ${activeLink === 0 && "active"}`}
            tabIndex={0}
            onClick={handleClick}
          >
            <TbWorld
              size={20}
              color={"white"}
              tabIndex={0}
              onClick={handleClick}
              style={{ userSelect: "none", outline: "none" }}
            />
          </Link>
          <Link
            to="/conversations/"
            className={`link ${activeLink === 1 && "active"}`}
            tabIndex={1}
            onClick={handleClick}
            onMouseEnter={() => setActiveLink(1)}
          >
            <AiOutlineMail
              size={20}
              color={"white"}
              tabIndex={1}
              onClick={handleClick}
              style={{ userSelect: "none", outline: "none" }}
            />

            <div className="span hover">Inbox(0)</div>
          </Link>
          <Link
            to="/integrations?accessToken=some-token"
            className={`link ${activeLink === 2 && "active"}`}
            tabIndex={2}
            onClick={handleClick}
          >
            <TbPlugConnected
              size={20}
              color={"white"}
              tabIndex={2}
              onClick={handleClick}
              style={{ userSelect: "none", outline: "none" }}
            />

            <div className="span hover">Integrations</div>
          </Link>
          <Link
            to="/customers"
            className={`link ${activeLink === 3 && "active"}`}
            tabIndex={3}
            onClick={handleClick}
          >
            <FiUsers
              size={20}
              color={"white"}
              tabIndex={3}
              onClick={handleClick}
              style={{ userSelect: "none", outline: "none" }}
            />
            <div className="span hover">Customers</div>
          </Link>
          <Link
            to="/accessKeys"
            className={`link ${activeLink === 3 && "active"}`}
            tabIndex={4}
            onClick={handleClick}
          >
            <FiKey
              size={20}
              color={"white"}
              tabIndex={4}
              onClick={handleClick}
              style={{ userSelect: "none", outline: "none" }}
            />
          <div className="span hover">Access Keys</div>
          </Link>
          <Link
            to="/HeaderForm"
            className={`link ${activeLink === 4 && "active"}`}
            tabIndex={6}
            onClick={handleClick}
          >
            <AiOutlineForm
              size={20}
              color={"white"}
              tabIndex={6}
              onClick={handleClick}
              style={{ userSelect: "none", outline: "none" }}
            />
          <div className="span hover">Header Form</div>
          </Link>
        </div>
        <div className="bottom">
          {/* <div
            className={`link ${activeLink === 4 && "active"}`}
            tabIndex={4}
            onClick={handleClick}
          >
            <AiFillSmile
              size={20}
              color={"white"}
              tabIndex={4}
              style={{ userSelect: "none", outline: "none" }}
              onClick={handleClick}
            />
          </div> */}
          <div
            className={`link ${activeLink === 5 && "active"}`}
            tabIndex={5}
            onClick={props.signOut}
          >
            <AiOutlineLogout
              size={20}
              color={"white"}
              tabIndex={5}
              style={{ userSelect: "none", outline: "none" }}
            />
            <div className="span hover">Sign Out</div>
          </div>
        </div>
      </div>
      <div className={`expaned ${activeLink === 1 && "active"}`} onMouseLeave={() => setActiveLink(0)}>
        <div className={`tab ${conversationTab && "active"}`}>
          <div
            className="tab-title"
            onClick={() => setConversationTab(!conversationTab)}
          >
            <span>Conversations</span>
            <div className="icon">
              {conversationTab ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
          </div>
          <div className="tab-links">
            <Link
              to="/conversations/all?accessToken=some-token"
              className={`link ${sublink === 1 && "active"}`}
              onClick={onSetSublink}
              tabIndex={1}
            >
              All
            </Link>
            <Link
              to="/conversations/me?accessToken=some-token"
              className={`link ${sublink === 2 && "active"}`}
              onClick={onSetSublink}
              tabIndex={2}
            >
              Assigned to me
            </Link>

            <Link
              to="/conversations/prioritized?accessToken=some-token"
              className={`link ${sublink === 3 && "active"}`}
              onClick={onSetSublink}
              tabIndex={3}
            >
              Prioritized
            </Link>
            <Link
              to="/conversations/closed?accessToken=some-token"
              className={`link ${sublink === 4 && "active"}`}
              onClick={onSetSublink}
              tabIndex={4}
            >
              {" "}
              Closed
            </Link>
          </div>
        </div>
        {/* <div className={`tab ${inboxesTab && "active"}`}>
          <div className="tab-title" onClick={() => setInboxesTab(!inboxesTab)}>
            <span>Inboxes</span>
            <div className="icon">
              {inboxesTab ? <IoIosArrowUp /> : <IoIosArrowDown />}
            </div>
          </div>
          <div className="tab-links">
            <div
              className={`link ${sublink === 8 && "active"}`}
              onClick={onSetSublink}
              tabIndex={8}
            >
              Primary Inbox
            </div>
          </div>
        </div>
        <div className="tab">
          <div className="tab-title">
            <AiOutlinePlus size={15} />
            <span className="ps-2 btns">Add Inbox</span>         
          </div>
          <div className="tab-title">
            <FiSettings size={15} />
            <span className="ps-2 btns">Configure Inbox</span>         
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Sidebar;
