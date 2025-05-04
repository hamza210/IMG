import { getAuth } from "firebase/auth";
import {
  collection,
  getCountFromServer,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import UserComponent from "../Component/UserComponent";
import { toast } from "react-toastify";
import AddTransactionModal from "../Component/AddTransactionModal";

const Dashboard = () => {
  const auth = getAuth();
  const [users, setUsers] = useState([]);
  const [searchUserText, setSearchUserText] = useState("");
  const [selecteduser, setSelecteduser] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(
    `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(
      2,
      "0"
    )}`
  );
  const [loadPaidData, setLoadPaidData] = useState(false);
  const [transactionsAddPopup, setTransactionsAddPopup] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(
      () => {
        handleFetch();
      },
      searchUserText.length > 0 ? 1000 : 0
    );

    return () => clearTimeout(delayDebounce);
  }, [searchUserText, loadPaidData, date]);

  const handleFetch = async () => {
    setUsers([]);
    setLoading(true);
    const usersRef = collection(db, "users");
    const dates = new Date(date);
    const monthYear = dates.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    let q;
    if (loadPaidData) {
      q = query(
        usersRef,
        where("Name", ">=", searchUserText.toLowerCase()),
        where("Name", "<=", searchUserText.toLowerCase() + "\uf8ff"),
        where("transactions", "array-contains", monthYear)
      );
    } else {
      q = query(
        usersRef,
        where("Name", ">=", searchUserText.toLowerCase()),
        where("Name", "<=", searchUserText.toLowerCase() + "\uf8ff")
      );
    }

    const snapshot = await getCountFromServer(q);
    setTotalCount(snapshot.data().count);
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      let arr = [];
      querySnapshot.forEach((doc) => {
        if (!loadPaidData) {
          const a = new Date(date);
          const b = a.toLocaleString("en-US", {
            month: "long",
            year: "numeric",
          });
          const transactions = doc.data().transactions || [];
          if (transactions.length == 0) {
            arr.push({ ...doc.data(), id: doc.id });
          } else if (!transactions.includes(b)) {
            arr.push({ ...doc.data(), id: doc.id });
          }
        } else {
          arr.push({ ...doc.data(), id: doc.id });
        }
      });
      setUsers(arr);
      setLoading(false);
      setError(false);
    } else {
      setLoading(false);
      setError(true);
    }
  };

  const handleSubmit = async (e, amount, mode) => {
    e.preventDefault();
    const dates = new Date();
    const monthYears = dates.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    const userdocRef = await updateDoc(doc(db, "users", selecteduser.id), {
      transactions: arrayUnion(monthYears),
    });
    const docRef = await addDoc(collection(db, "transaction"), {
      Amount: Number(amount),
      Mode: mode,
      createdBy: auth.currentUser.email,
      Date: new Date(),
      UserName: selecteduser.Name,
    });
    if (docRef) {
      toast.success("Transaction added succesfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        progress: undefined,
        theme: "light",
      });
      handleFetch();
      setTransactionsAddPopup(false);
    } else {
      toast.error("Transaction added failed", {
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

  const handleExport = () => {
    const ab = new Date(date);
    const b = ab.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    const styles = `
    <style>
      table {
        border-collapse: collapse;
        width: 100%;
        font-family: Arial, sans-serif;
      }
      th, td {
        border: 1px solid #888;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #f2f2f2;
        font-weight: bold;
      }
      tfoot td {
        font-weight: bold;
        background-color: #e0e0e0;
      }
      tbody tr:nth-child(even) {
        background-color: #f9f9f9;
      }
    </style>
  `;
    const table = `
    ${styles}
    <table border={1}>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Contact No</th>
              <th scope="col">Amount</th>
              <th scope="col">Month</th>
              <th scope="col">Paid/Unpaid</th>
            </tr>
          </thead>
          <tbody>
            ${users?.map((user) => {
              return `<tr>
                <td scope="col">${user.Name}</td>
                <td scope="col">${user.Contact_no}</td>
                <td scope="col">${user.Amount || "100"}</td>
                <td scope="col">${new Date(date).toDateString()}</td>
                <td scope="col">
                  ${user.transactions.includes(b) ? "PAID" : "UNPAID"}
                </td>
              </tr>`;
            })}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="2">Total Amount</td>
          <td colspan="3">10000</td>
            </tr>
          </tfoot>
        </table>
      `;
    const blob = new Blob([table], { type: "application/vnd.ms-excel" });
    const url = URL.createObjectURL(blob);

    // Trigger download
    const a = document.createElement("a");
    a.href = url;
    a.download = `${b}_Monthly.xls`; // .xls to open in Excel
    a.click();

    // Clean up
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      {transactionsAddPopup && (
        <div className="position-absolute">
          <AddTransactionModal
            setTransactionsAddPopup={setTransactionsAddPopup}
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
        <div style={{ height: "calc(100dvh - 100px)", overflow: "hidden" }}>
          <header className=" w-100 p-2 d-flex flex-row column-gap-3 justify-content-around">
            <p className="lead mb-1">Total Users: {totalCount}</p>
            <input
              className="p-1"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="month"
            />
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
          <section className="mx-2 mb-2">
            <div
              onClick={() => handleExport()}
              className="w-100 btn btn-info btn-md"
            >
              Export Data
            </div>
          </section>
          <section style={{ columnGap: "1px" }} className="d-flex w-100">
            <div
              onClick={() => setLoadPaidData(false)}
              className={`w-50 bg-${
                loadPaidData ? "primary" : "success"
              } text-white text-center py-2`}
            >
              Not Paid
            </div>
            <div
              onClick={() => setLoadPaidData(true)}
              className={`w-50 bg-${
                loadPaidData ? "success" : "primary"
              } text-white text-center py-2`}
            >
              Paid
            </div>
          </section>
          <main
            style={{
              overflowY: "scroll",
              height: "calc(100% - 180px)",
              paddingBottom: "20px",
            }}
            className="d-flex flex-wrap gap-3 w-100 p-2"
          >
            {users.map((user, index) => {
              return (
                <div style={{ height: "166px" }} className="w-100" key={index}>
                  <UserComponent
                    handleClick={(user) => {
                      setSelecteduser(user);
                      setTransactionsAddPopup(true);
                    }}
                    addBtn={
                      new Date().getMonth() + 1 ==
                        new Date(date).getMonth() + 1 &&
                      new Date().getFullYear() ==
                        new Date(date).getFullYear() &&
                      !loadPaidData
                        ? true
                        : false
                    }
                    user={user}
                  />
                </div>
              );
            })}
          </main>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
