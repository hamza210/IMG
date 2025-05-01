import { getAuth } from "firebase/auth";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import AddUserModal from "../Component/AddUserModal";
import { v4 as uuidv4 } from "uuid";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import UserComponent from "../Component/UserComponent";
import { toast } from "react-toastify";

const User = () => {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [searchUserText, setSearchUserText] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAddPopup, setUserAddPopup] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(
      () => {
        handleFetch();
      },
      searchUserText.length > 0 ? 1000 : 0
    );

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
    const snapshot = await getCountFromServer(q);
    setTotalCount(snapshot.data().count);
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      let arr = [];
      querySnapshot.forEach((doc) => {
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

  const handleSubmit = async (e, username, contact, address) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "users"), {
      Name: username.toLowerCase(),
      Address: address,
      Contact_no: contact,
      id: uuidv4(),
    });
    if (docRef) {
      toast.success("User added succesfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        progress: undefined,
        theme: "light",
      });
      setUserAddPopup(false);
    } else {
      toast.error("User added failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div>
      {userAddPopup && (
        <div className="position-absolute">
          {" "}
          <AddUserModal
            setUserAddPopup={setUserAddPopup}
            handleSubmit={handleSubmit}
          />{" "}
        </div>
      )}
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
        <div style={{height:'90dvh',overflow:'hidden'}}>
          <header className=" w-100 p-2 d-flex flex-column gap-3 justify-content-between">
            <button
              onClick={() => setUserAddPopup(true)}
              className="btn btn-primary d-block"
            >
              Add User
            </button>
            <p className="lead mb-1">Total Users: {totalCount}</p>
          </header>
          <section className=" w-100 p-2">
            <InputGroup className="mb-3">
              <InputGroup.Text id="basic-addon1">Search</InputGroup.Text>
              <Form.Control
                value={searchUserText}
                onChange={(e) => setSearchUserText(e.target.value)}
                placeholder="Username"
                aria-label="Username"
                aria-describedby="basic-addon1"
              />
            </InputGroup>
          </section>
          <main style={{overflowY:'scroll',height:'66dvh'}} className="d-flex flex-wrap gap-3 w-100 p-2">
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
