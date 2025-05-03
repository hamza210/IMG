import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import "../routes/Login.css";

const AddTransactionModal = ({ handleSubmit, setTransactionsAddPopup }) => {
  const [amount, setAmount] = useState("");
  const [mode, setmode] = useState("");

  return (
    <div className="sign-in__wrapper" style={{ backgroundColor: "#ACDDDE" }}>
      <div
        style={{ backgroundColor: "rgba(0,0,0,0.6)", zIndex: "1" }}
        className="sign-in__backdrop"
      ></div>

      <Form
        style={{ zIndex: "2" }}
        className="shadow p-4 bg-white rounded"
        onSubmit={(e) => handleSubmit(e, amount, mode)}
      >
        <div className="h4 mb-2 text-center">ADD Transaction</div>

        <Form.Group className="mb-2" controlId="username">
          <Form.Label>Amount</Form.Label>
          <Form.Control
            type="number"
            value={amount}
            placeholder="Amount"
            onChange={(e) => setAmount(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="contact">
          <Form.Label>Mode</Form.Label>
          <div className="w-75 d-flex flex-row justify-content-between">

          <div>
            <label style={{paddingRight:'10px'}} htmlFor="Cash">Cash</label>
            <input
              onChange={() => setmode("Cash")}
              checked={mode === "Cash" ? true : false}
              type="radio"
              title="Cash"
              name="Cash"
              id="Cash"
              />
          </div>
          <div>
            <label style={{paddingRight:'10px'}}  htmlFor="Cash">Online</label>
            <input
              onChange={() => setmode("Online")}
              checked={mode === "Online" ? true : false}
              type="radio"
              name="Online"
              id="Online"
              />
          </div>
              </div>
        </Form.Group>

        <Button className="w-100 my-2" variant="primary" type="submit">
          Add Transaction
        </Button>
        <Button
          onClick={(e) => {
            e.preventDefault();
            setTransactionsAddPopup(false);
          }}
          className="w-100 my-2"
          variant="primary"
          type="button"
        >
          Cancel
        </Button>
      </Form>
    </div>
  );
};

export default AddTransactionModal;
