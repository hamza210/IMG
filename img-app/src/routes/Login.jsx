import React, { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import "./Login.css";
import { getAuth, signInWithEmailAndPassword  } from "firebase/auth";
import { useNavigate } from "react-router";

const Login = () => {
  const auth = getAuth()
  const navigate = useNavigate()
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");

  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    signInWithEmailAndPassword (auth, inputUsername, inputPassword)
    .then((userCredential) => {
      const user = userCredential.user;
      navigate('/dashboard')
      setLoading(false);
    })
    .catch((error) => {
      console.log(error)
      alert(error.message)
      setLoading(false);
      setShow(true);
      setTimeout(() => {
        setShow(false);
      }, 200);
  });
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundColor: '#ACDDDE' }}
    >
      <div className="sign-in__backdrop"></div>

      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        
        <header className="display-4 text-center mb-4">IMG</header>
        <div className="h4 mb-2 text-center">Sign In</div>
       
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Incorrect username or password.
          </Alert>
        ) : (
          <div />
        )}
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
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Password"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>

        {!loading ? (
          <Button className="w-100 my-2" variant="primary" type="submit">
            Log In
          </Button>
        ) : (
          <Button className="w-100 my-2" variant="primary" type="submit" disabled>
            Logging In...
          </Button>
        )}
        {/* <div className="d-grid justify-content-end">
          <Button
            className="text-muted px-0"
            variant="link"
            onClick={handlePassword}
          >
            Forgot password?
          </Button>
        </div> */}
      </Form>
     
      <div className="w-100 mb-2 position-absolute bottom-0 start-50 translate-middle-x text-white text-center">
        Made by Hamza khan | &copy; {new Date().getFullYear()}
      </div>
    </div>
  );
};

export default Login;
