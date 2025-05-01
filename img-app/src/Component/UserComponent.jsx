import React from "react";
import { Card } from "react-bootstrap";

const UserComponent = ({ user }) => {
  return (
    <Card style={{backgroundColor:'#ACDDDE'}}>
      <Card.Body>
        <div>
          <p style={{fontWeight:'600',fontSize:'16px',textTransform:'capitalize'}} className="lead mb-0 ">{user.Name}</p>
          <p style={{fontWeight:'400',fontSize:'12px'}} className="small mb-1">Name</p>
        </div>
        <div>
          <p style={{fontWeight:'600',fontSize:'16px'}} className="lead mb-0 ">{user.Contact_no}</p>
          <p style={{fontWeight:'400',fontSize:'12px'}} className="small mb-1">Contact no</p>
        </div>
        <div>
          <p style={{fontWeight:'600',fontSize:'16px',textWrap:'wrap'}} className="lead mb-0 ">{user.Address}</p>
          <p style={{fontWeight:'400',fontSize:'12px'}} className="small mb-0">Address</p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserComponent;
