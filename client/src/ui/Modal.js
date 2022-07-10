import React, { useMemo, useState, useContext } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { GrAddCircle } from "react-icons/gr";
import { IoMdRemoveCircleOutline } from "react-icons/io";
import Web3Context from "../contexts/web3/Web3Context";

// mode = "create" || "edit"

function ModalForm({ mode }) {
  const [show, setShow] = useState(false);
  const [addressCount, setAddressCount] = useState(0);
  const { address, setAddress } = useContext(Web3Context);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const count = useMemo(() => {
    return [...Array(addressCount).keys()];
  }, [addressCount]);

  const incrementCount = (e) => {
    e.preventDefault();
    setAddressCount(addressCount + 1);
  };

  const decrementCount = (e) => {
    e.preventDefault();
    setAddressCount(addressCount - 1);
  };

  const isMetamaskAddress = (e) => {
    if(!e.target.value.startsWith("0x")){
      e.target.value = '';
      alert('Address entered is not Metamask address');
    }    
  }
 
  return (
    <>
    {
      mode === 'create' ? (
      <button
        style={{ border: "none", outline: "none", background: "transparent" }}
        onClick={handleShow}
      >
        <GrAddCircle size={30} />{" "}
      </button>
      ) : (
        <button
        onClick={handleShow}
        className="btn btn-primary"
        >
          Edit
        </button> 
      )
    }
      

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add new organization</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form form action="/createOrganization" enctype="multipart/form-data" method="post">
            <Form.Group className="mb-3" controlId="formBasicImage">
              <Form.Label>Logo</Form.Label>
              <Form.Control type="file" placeholder="Logo" name="imageURL" required/>
              <Form.Text className="text-muted">
                Insert logo of your organization
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Organization name</Form.Label>
              <Form.Control type="text" placeholder="Enter organization name" name="organizationName" required/>
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
                      value={address}
                      placeholder="Enter address"
                      name="createdBy"
                    />
                    <Form.Text className="text-muted">Insert address</Form.Text>
              {count.length &&
                count.map((el) => (
                  <React.Fragment key={el}>
                    <button
                      style={{
                        position: "absolute",
                        right: "0px",
                        border: "none",
                        outline: "none",
                      }}
                      onClick={decrementCount}
                    >
                      <IoMdRemoveCircleOutline size={20} />{" "}
                    </button>
                    <Form.Control
                      onChange={isMetamaskAddress}
                      placeholder="Enter address"
                      required
                      name="address[count]"
                    />
                    <Form.Text className="text-muted">Insert address</Form.Text>
                  </React.Fragment>
                ))}
            </Form.Group>

            <Button variant="primary"  type ="submit" value="Upload" >
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
