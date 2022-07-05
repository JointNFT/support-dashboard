import React, { useMemo, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { GrAddCircle } from "react-icons/gr";
import { IoMdRemoveCircleOutline } from "react-icons/io";


function ModalForm() {
  const [show, setShow] = useState(false);
  const [emailCount, setEmailCount] = useState(1);
  

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const count = useMemo(() => {
    return [...Array(emailCount).keys()];
  }, [emailCount]);

  const incrementCount = (e) => {
    e.preventDefault();
    setEmailCount(emailCount + 1);
  };

  const decrementCount = (e) => {
    e.preventDefault();
    setEmailCount(emailCount - 1);
  };

 
  return (
    <>
      <button
        style={{ border: "none", outline: "none", background: "transparent" }}
        onClick={handleShow}
      >
        <GrAddCircle size={30} />{" "}
      </button>

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
              <Form.Control type="file" placeholder="Logo" name="imageURL"/>
              <Form.Text className="text-muted">
                Insert logo of your organization
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Organization name</Form.Label>
              <Form.Control type="text" placeholder="Enter organization name" name="organizationName"/>
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
                      placeholder="Enter address"
                      required
                      name="address[count]"
                    />
                    <Form.Text className="text-muted">Insert address</Form.Text>
                  </React.Fragment>
                ))}
            </Form.Group>

            <Button variant="primary" type="submit" value="Upload">
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
