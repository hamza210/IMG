import { getAuth } from "firebase/auth";
import { collection, getAggregateFromServer, getDocs, query, sum, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import UserComponent from "../Component/UserComponent";
import TransactionComponent from "../Component/TransactionComponent";

const Transaction = () => {
  const auth = getAuth();
  const [transactions, setTranactions] = useState([]);
  const [searchTransText, setSearchTransText] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleFetch();
    }, searchTransText.length > 0 ? 1000 : 0);
  
    return () => clearTimeout(delayDebounce); 
  }, [searchTransText]);

  const handleFetch = async () => {
    setLoading(true);
    const usersRef = collection(db, "transaction");
    const q = query(
      usersRef,
      where("Name", ">=", searchTransText.toLowerCase()),
      where("Name", "<=", searchTransText.toLowerCase() + "\uf8ff")
    );

    const snapshot = await getAggregateFromServer(q, {
      totalTransaction: sum('Amount')
    });
    setTotalAmount(snapshot.data().totalTransaction)

    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      let arr = [];
      querySnapshot.forEach((doc) => {
        console.log(doc);
        arr.push(doc.data());
      });
      setTranactions(arr);
      setLoading(false);
      setError(false);
    } else {
      setLoading(false);
      setError(true);
    }
  };

  return (
    <div>
      {loading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <Spinner />
        </div>
      ) : error ? (
        <div className="d-flex flex-column justify-content-start align-items-center vh-100">
          <p className="text-danger display-4">Something went wrong! </p>
          <p className="text-danger lead">Please Try Again Later</p>
        </div>
      ) : (
        <div>
          <header className=" w-100 p-2 d-flex flex-column gap-3 justify-content-between">
            <button className="btn btn-primary d-block">Add Transaction</button>
            <p className="lead mb-1">Total Transaction: {transactions.length}</p>
            <p className="lead mb-1">Total Amount: {totalAmount}</p>
          </header>
          <section className=" w-100 p-2">
            <InputGroup className="mb-3">
              <InputGroup.Text
                id="basic-addon1"
              >
                Search
              </InputGroup.Text>
              <Form.Control
                value={searchTransText}
                onChange={(e) => setSearchTransText(e.target.value)}
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </section>
          <main className="d-flex flex-wrap gap-3 w-100 p-2">
            {transactions.map((transaction, index) => {
              return (
                <div className="w-100" key={index}>
                  <TransactionComponent transaction={transaction} />
                </div>
              );
            })}
          </main>
        </div>
      )}
    </div>
  );
};

export default Transaction;
