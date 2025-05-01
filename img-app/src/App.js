import './App.css';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import { Navigate, Outlet, useNavigate } from 'react-router';
import { useAuth } from './Hooks/auth';
import Login from './routes/Login';


function App() {
  const navigate = useNavigate()
  const  {login}  = useAuth()
  return (
    login ?
      <>
        <Navbar collapseOnSelect bg="primary" data-bs-theme="dark" key={'sm'} expand={'sm'} className="mx-auto mb-3">
          <Container fluid>
            <Navbar.Brand onClick={() => navigate('/dashboard')}>IMG</Navbar.Brand>
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

                <Nav className="justify-content-around sm:h-100 sm:flex-col sm:justify-content-between h-screen   flex-grow-1 pe-3">
                  <Nav>
                    <Nav.Link eventKey={1} onClick={() => navigate('/dashboard')}>Home</Nav.Link>
                    <Nav.Link eventKey={2} onClick={() => navigate('/users')}>Users</Nav.Link>
                    <Nav.Link eventKey={3} onClick={() => navigate('/transactions')}>Transactions</Nav.Link>
                  </Nav>
                  <Nav.Link eventKey={4} onClick={() => navigate('/login')}>
                    Logout
                  </Nav.Link>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Container>
        </Navbar>
        <Outlet />
      </>
      : <Login />
  );
}

export default App;
