import React, { useMemo, useState, useContext, useEffect } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { GrAddCircle } from "react-icons/gr";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import Web3Context from "../contexts/web3/Web3Context";

function ModalForm({ org }) {
  const [show, setShow] = useState(false);
  const [addressList, setAddressList] = useState([]);
  const [ addressCount, setAddressCount ] = useState(0)
  const [formData, setFormData] = useState({});
  useEffect(() => {
    if(!show) {
        return;
    }
    setFormData({
        name: org?.name || "",
        organizationId: org?.organizationId || null,
        addresses: org?.addresses || [],
        image: null,
        createdBy: org?.createdBy || "",
      });
      const list = org?.addresses?.filter(a => a !== org?.createdBy);
      setAddressList(list);
      setAddressCount(list?.length);
  },[org, show]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const count = useMemo(() => {
    return [...Array(addressCount).keys()];
  }, [addressCount]);
  console.log(count)
  const incrementCount = (e) => {
    e.preventDefault();
    setAddressCount(addressCount + 1);
  };

  const decrementCount = (e,index) => {
    e.preventDefault();
    const removedAddress = addressList[index]
    const tempList = addressList?.filter(a => a !== removedAddress);
    setAddressList(tempList);
    setAddressCount(addressCount - 1);
  };

  const isMetamaskAddress = (e) => {
    if (!e.target.value.startsWith("0x")) {
      e.target.value = "";
      alert("Address entered is not Metamask address");
    }
  };
 
  const handleSubmit = () => {
    const data = {
        ...formData,
        addresses: [formData?.createdBy,...addressList]
    }
    console.log(data)
  }
  console.log(org)
  console.log(formData)
  return (
    <>
      <button onClick={handleShow} className="btn btn-primary">
        Edit
      </button>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Organization Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Logo</Form.Label>
              <Form.Control
                type="file"
                placeholder="Logo"
                name="imageURL"
                required
                onChange={(e) => setFormData({...formData, image: e.target.files[0]})}
              />
              <Form.Text className="text-muted">
                Insert logo of your organization
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Organization name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                placeholder="Enter organization name"
                name="organizationName"
                required
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
              <Form.Text className="text-muted">
                Insert organization name
              </Form.Text>
            </Form.Group>
            <Form.Group
              className="mb-3"
              controlId="formBasicEmail"
              style={{
                position: "relative",
              }}
            >
              <button
                style={{
                  position: "absolute",
                  right: "0px",
                  border: "none",
                  outline: "none",
                  zIndex: "999",
                }}
                onClick={incrementCount}
              >
                <GrAddCircle size={20} />{" "}
              </button>
              <Form.Label>Address list </Form.Label>
              <Form.Control
                value={formData.createdBy}
                placeholder="Enter address"
                name="createdBy"
                disabled
              />
              <Form.Text className="text-muted">Insert address</Form.Text>
              {addressCount &&
                count.map((el) => (
                  <React.Fragment key={el}>
                    <button
                      style={{
                        position: "absolute",
                        right: "0px",
                        border: "none",
                        outline: "none",
                      }}
                      onClick={(e) => { 
                        decrementCount(e, el);
                    }}
                    >
                      <IoMdRemoveCircleOutline size={20} />{" "}
                    </button>
                    <Form.Control
                      onChange={(e) => {
                        isMetamaskAddress(e);
                        const tempList = [...addressList];
                        tempList[el] = e.target.value;
                        setAddressList(tempList)
                    }}
                      placeholder="Enter address"
                      required
                      value={addressList?.[el] || ""}
                      name="address[count]"
                    />
                    <Form.Text className="text-muted">Insert address</Form.Text>
                  </React.Fragment>
                ))}
            </Form.Group>

            <Button variant="primary" onClick={handleSubmit}>
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          {/*<Button variant="primary">Understood</Button>*/}
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalForm;
