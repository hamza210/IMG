import React from "react";
import { Card } from "react-bootstrap";

const TransactionComponent = ({ transaction }) => {
  return (
    <Card style={{backgroundColor:'#ACDDDE'}}>
      <Card.Body>
        <div className="d-flex flex-row justify-content-between">

        <div>
          <p style={{fontWeight:'600',fontSize:'16px',textTransform:'capitalize'}} className="lead mb-0 ">{transaction.Amount}</p>
          <p style={{fontWeight:'400',fontSize:'12px'}} className="small mb-1">Amount</p>
        </div>
        <div>
          <p style={{fontWeight:'600',fontSize:'16px',textWrap:'wrap'}} className="lead mb-0 text-capitalize">{transaction.Name}</p>
          <p style={{fontWeight:'400',fontSize:'12px',textAlign:'right'}} className="small mb-0">Username</p>
        </div>
        </div>
        <div className="d-flex flex-row justify-content-between">
        <div>
          <p style={{fontWeight:'600',fontSize:'16px',textWrap:'wrap'}} className="lead mb-0 ">{transaction.Mode}</p>
          <p style={{fontWeight:'400',fontSize:'12px'}} className="small mb-0">Mode</p>
        </div>
        <div>
          <p style={{fontWeight:'600',fontSize:'16px'}} className="lead mb-0 ">{transaction.Date.toDate().toLocaleString()}
          </p>
          <p style={{fontWeight:'400',fontSize:'12px',textAlign:'right'}} className="small mb-1">Date</p>
        </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionComponent;
