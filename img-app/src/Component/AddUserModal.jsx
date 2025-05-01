import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../routes/Login.css";

const AddUserModal = ({handleSubmit,setUserAddPopup}) => {

  const [inputUsername, setInputUsername] = useState("");
  const [inputUserAddress, setInputUserAddress] = useState("");
  const [inputContact, setInputContact] = useState("");

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundColor: '#ACDDDE' }}
    >
      <div style={{backgroundColor:'rgba(0,0,0,0.6)',zIndex:'1'}} className="sign-in__backdrop"></div>

      <Form style={{zIndex:'2'}} className="shadow p-4 bg-white rounded" onSubmit={(e) => handleSubmit(e,inputUsername,inputContact,inputUserAddress)}>
        
        <div className="h4 mb-2 text-center">ADD USER</div>
       
        
        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Username"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="contact">
          <Form.Label>Contact No</Form.Label>
          <Form.Control
            type="number"
            value={inputContact}
            placeholder="Contact"
            onChange={(e) => setInputContact(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="address">
          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            value={inputUserAddress}
            placeholder="Address"
            onChange={(e) => setInputUserAddress(e.target.value)}
          />
        </Form.Group>

       
          <Button className="w-100 my-2" variant="primary" type="submit">
            Add user
          </Button>
          <Button onClick={(e) => {
            e.preventDefault()
            setUserAddPopup(false)
          }} className="w-100 my-2" variant="primary" type="button">
            Cancel
          </Button>
        
      </Form>
         </div>
  );
};

export default AddUserModal;
