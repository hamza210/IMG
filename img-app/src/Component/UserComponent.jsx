import React from "react";
import { Card } from "react-bootstrap";

const UserComponent = ({ user,addBtn,handleClick }) => {
  return (
    <Card style={{backgroundColor:'#ACDDDE',position:'relative'}}>
      <Card.Body>
        <div onClick={() => handleClick(user)} className="btn btn-sm btn-primary" style={{position:'absolute',top:'15px',right:'15px',display:!addBtn ? 'none' : 'flex'}}>
          Pay
        </div>
        <div>
          <p style={{fontWeight:'600',fontSize:'16px',textTransform:'capitalize'}} className="lead mb-0 ">{user.Name}</p>
          <p style={{fontWeight:'400',fontSize:'12px'}} className="small mb-1">Name</p>
        </div>
        <div className="d-flex flex-row justify-content-between">
          <div>

          <p style={{fontWeight:'600',fontSize:'16px'}} className="lead mb-0 ">{user.Contact_no}</p>
          <p style={{fontWeight:'400',fontSize:'12px'}} className="small mb-1">Contact no</p>
          </div>
          <div>

          <p style={{fontWeight:'600',fontSize:'16px'}} className="lead mb-0 ">{user.createdBy || 'Na'}</p>
          <p style={{fontWeight:'400',fontSize:'12px',textAlign:'right'}} className="small mb-1">Created By</p>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default UserComponent;
