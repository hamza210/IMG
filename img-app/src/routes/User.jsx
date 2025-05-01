import { getAuth } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import UserComponent from "../Component/UserComponent";

const User = () => {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [searchUserText, setSearchUserText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      handleFetch();
    }, searchUserText.length > 0 ? 1000 : 0);
  
    return () => clearTimeout(delayDebounce); 
  }, [searchUserText]);

  const handleFetch = async () => {
    setLoading(true);
    const usersRef = collection(db, "users");
    const q = query(
      usersRef,
      where("Name", ">=", searchUserText.toLowerCase()),
      where("Name", "<=", searchUserText.toLowerCase() + "\uf8ff")
    );

    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      let arr = [];
      querySnapshot.forEach((doc) => {
        console.log(doc);
        arr.push(doc.data());
      });
      setUsers(arr);
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
            <button className="btn btn-primary d-block">Add User</button>
            <p className="lead mb-1">Total Users: {users.length}</p>
          </header>
          <section className=" w-100 p-2">
            <InputGroup className="mb-3">
              <InputGroup.Text
                id="basic-addon1"
              >
                Search
              </InputGroup.Text>
              <Form.Control
                value={searchUserText}
                onChange={(e) => setSearchUserText(e.target.value)}
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </section>
          <main className="d-flex flex-wrap gap-3 w-100 p-2">
            {users.map((user, index) => {
              return (
                <div className="w-100" key={index}>
                  <UserComponent user={user} />
                </div>
              );
            })}
          </main>
        </div>
      )}
    </div>
  );
};

export default User;
