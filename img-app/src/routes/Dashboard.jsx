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
  getAggregateFromServer,
  Timestamp,
  sum,
} from "firebase/firestore";
import * as XLSX from "xlsx";
import React, { useEffect, useState } from "react";
import { db } from "../firebase.config";
import { Form, InputGroup, Spinner } from "react-bootstrap";
import UserComponent from "../Component/UserComponent";
import { toast } from "react-toastify";
import AddTransactionModal from "../Component/AddTransactionModal";

const Dashboard = () => {
  const auth = getAuth();
  const [monthlyTransactions, setmonthlyTransactions] = useState([]);
  const [monthlyUser, setMonthlyUser] = useState([]);
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

  useEffect(() => {
    handleTransactionData();
  }, [date]);

  const handleTransactionData = async () => {
    const transref = collection(db, "transaction");
    const usersRef = collection(db, "users");
    const dateObj = new Date(date);
    const start = new Date(dateObj.getFullYear(), dateObj.getMonth(), 1);
    const end = new Date(dateObj.getFullYear(), dateObj.getMonth() + 1, 1);
    const q = query(
      transref,
      where("Date", ">=", start),
      where("Date", "<", end)
    );
    const userq = query(usersRef);

    const snapshot = await getAggregateFromServer(q, {
      totalTransaction: sum("Amount"),
    });
    setTotalAmount(snapshot.data().totalTransaction);
    const querySnapshot = await getDocs(q);
    if (querySnapshot) {
      let arr = [];
      querySnapshot.forEach((doc) => {
        arr.push(doc.data());
      });
      setmonthlyTransactions(arr);
    }
    const userquerySnapshot = await getDocs(userq);
    if (userquerySnapshot) {
      let arr = [];
      userquerySnapshot.forEach((doc) => {
        arr.push({ ...doc.data(), id: doc.id });
      });
      setMonthlyUser(arr);
    }
  };

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

  const handleSubmit = async (e, amount, mode, advancemonths) => {
    e.preventDefault();
    let months = Array.from({ length: advancemonths }, (m, index) => {
      const mdate = new Date(
        new Date().setMonth(new Date().getMonth() + index)
      );
      const mmonth = mdate.toLocaleString("en-US", {
        month: "long",
        year: "numeric",
      });
      return mmonth;
    });
    const dates = new Date();
    const monthYears = dates.toLocaleString("en-US", {
      month: "long",
      year: "numeric",
    });
    let trans = advancemonths
      ? [...selecteduser.transactions, ...months]
      : [...selecteduser.transactions, monthYears];
    const userdocRef = await updateDoc(doc(db, "users", selecteduser.id), {
      transactions: trans,
    });
    const docRef = await addDoc(collection(db, "transaction"), {
      Amount: Number(amount),
      Mode: mode,
      createdBy: auth.currentUser.email,
      Date: Timestamp.fromDate(new Date()),
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
    
      let total = 0;
    
      const data = monthlyUser.map((user) => {
        const transaction = monthlyTransactions?.find((t) => {
          const match = t?.UserName?.toLowerCase() === user?.Name?.toLowerCase();
          total += match ? t.Amount : 0;
          return match;
        });
    
        return {
          Name: user?.Name?.toUpperCase(),
          "Contact No": user?.Contact_no,
          Amount: transaction?.Amount || 0,
          Status: user?.transactions?.includes(b) ? "PAID" : "UNPAID",
        };
      });
    
      // Add total row
      data.push({
        Name: "TOTAL",
        "Contact No": "",
        Amount: total,
        Status: "",
      });
    
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, `${b} Monthly Report`);
    
      XLSX.writeFile(wb, `${b}_Report.xlsx`);
  };

  return (
    <div>
      {transactionsAddPopup && (
        <div className="position-absolute top-0">
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
          <header className=" w-100 p-2 d-flex flex-row justify-content-even">
            <p className="lead mb-1">Total Users: {totalCount}</p>

            <input
              className="p-1 mx-3"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              type="month"
            />
          </header>
          <div className="px-2 w-full">
            <p className="lead mb-1">Total Amount: {totalAmount}</p>
          </div>
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
              height: "calc(100% - 250px)",
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
