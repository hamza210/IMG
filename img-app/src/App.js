import "./App.css";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Offcanvas from "react-bootstrap/Offcanvas";
import { Outlet, useNavigate } from "react-router";
import { useAuth } from "./Hooks/auth";
import Login from "./routes/Login";
import { getAuth, signOut } from "firebase/auth";
import { Spinner } from "react-bootstrap";
import { toast } from "react-toastify";

function App() {
  const navigate = useNavigate();
  const { login, checkingStatus } = useAuth();
  const auth = getAuth();

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        toast.success("Successfully Logout", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          progress: undefined,
          theme: "light",
        });
        navigate("/login");
      })
      .catch((error) => {
        alert(error.message);
      });
  };
  return login ? (
    <>
      <Navbar
        collapseOnSelect
        bg="primary"
        data-bs-theme="dark"
        key={"sm"}
        expand={"sm"}
        className="mx-auto mb-3"
      >
        <Container fluid>
          <Navbar.Brand
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/dashboard")}
          >
            IMG
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
          <Navbar.Offcanvas
            id={`offcanvasNavbar-expand-sm`}
            aria-labelledby={`offcanvasNavbarLabel-expand-sm`}
            placement="start"
          >
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                IMG
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-lg-around h-100 flex-column flex-lg-row justify-content-between flex-grow-1 pe-3">
                <Nav>
                  <Nav.Link eventKey={1} onClick={() => navigate("/dashboard")}>
                    Home
                  </Nav.Link>
                  <Nav.Link eventKey={2} onClick={() => navigate("/users")}>
                    Users
                  </Nav.Link>
                  <Nav.Link
                    eventKey={3}
                    onClick={() => navigate("/transactions")}
                  >
                    Transactions
                  </Nav.Link>
                </Nav>
                <Nav.Link eventKey={4} onClick={() => handleLogout()}>
                  Logout
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Outlet />
    </>
  ) : checkingStatus ? (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Spinner />
    </div>
  ) : (
    <Login />
  );
}

export default App;
