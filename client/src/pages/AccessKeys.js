import React,{ useEffect, useContext, useState } from "react";
import UserContext from "../contexts/user/UserContext";
import Sidebar from '../components/layout/Sidebar/Sidebar'
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ModalForm from "../ui/Modal";
// dev only
const addressList = [
  "0xcbca97f55E57BFF371800Eb68BE9d93242E565a3",
  "0xcbca97f55E57BFF371800Eb68BE9d93242E565a3",
  "0xcbca97f55E57BFF371800Eb68BE9d93242E565a3",
  "0xcbca97f55E57BFF371800Eb68BE9d93242E565a3",
  "0xcbca97f55E57BFF371800Eb68BE9d93242E565a3"
];
const AccessKey = ({ content }) => {
  const [ show, setShow ] = React.useState(false);
  const toggleShowKey = React.useCallback(() => {
    setShow(o => !o)
  },[]);
  const hiddenKey = Array(content?.length).fill("*",0);
  const style = {
    display: 'inline',
    marginRight: 5,
    verticalAlign: 'inherit',
  }
  if(show) return <span><FaEye onClick={toggleShowKey} style={{...style,verticalAlign: 'middle'}}/> {content} </span>
  return <span style={{color: '#bcbcbc'}}>
        <FaEyeSlash onClick={toggleShowKey} style={style}/>
        {
          hiddenKey.join("")
        }
  </span>
}
const AccessKeys = ({signOut}) => {
  const { orgID } = useContext(UserContext);
  const [organization, setOrganization ] = React.useState({});

  function getOrganization(orgID) {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    var requestOptions = {
        method: "GET",
        headers: myHeaders,
        redirect: "follow",            
    };

    fetch("/getOrganization?orgID=" + orgID, requestOptions)
        .then((response) => response.text())
        .then(async(result) => {
            const org = await JSON.parse(result);
            setOrganization(org.data)             
        })
        .catch((error) => console.log("error", error));
}
  useEffect(() => {
    getOrganization(orgID)
  },[]);
  console.log(organization)
  return (
    <div className="wrapp">
	    <Sidebar signOut={signOut} />
      <div className="content" style={{overflowY: 'auto'}}>
        <div className="customers" style={{width: '100%', maxWidth: 1000, margin: '0 auto'}}>
          <div className="justify">
            <div className="d-flex justify-content-between mt-5">
              <div>
                <h4>Access Keys</h4>
                <p>View all your access keys</p>
              </div>
              <div>            
                <ModalForm mode="edit" />               
              </div>
            </div>
          </div>

          <div className="popular mt-3" style={{width: '100%', margin: '0 auto'}}>
            <div className="row">
              <div className="row-head">
                <div className="name column">Organization</div>
                <div className="name column">API Key</div>
              </div>
              <div className="row-body">
                <div className="name column">Company Name</div>
                <div className="name column">{organization?.name}</div>
              </div>
              <div className="row-body">
                <div className="name column">Company Logo</div>
                <div className="name column">
                  <img width={250} height={250} src={organization?.image}/>
                </div>
              </div>
              <div className="row-body">
                <div className="name column">Access Key</div>
                <div className="name column"><AccessKey content={organization?.accessToken}/></div>
              </div>
              <div className="row-body">
                <div className="name column">Staff List</div>
                <div className="name column">
                  {                   
                    organization?.address?.substring(1,organization?.address?.length - 1)?.split(",")?.map((a,i )=> <div key={i}>{a}</div>)
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessKeys;
