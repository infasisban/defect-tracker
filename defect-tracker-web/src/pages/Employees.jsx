import React, { useState, useEffect } from "react";
import axios from "axios";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";

const Employee = () => {
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    const fetchEmployees = async () => {
        setLoading(true);
        const snapshot = await getDocs(collection(db, "employees"));
        setEmployees(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
        setLoading(false);
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleAddEmployee = async (e) => {
        e.preventDefault();
        if (!name || !email || !phone || !address)
            return alert("All fields required!");

        try {
            await axios.post("http://localhost:5000/add-employee", {
                name,
                email,
                phone,
                address,
            });
            alert("Employee added!");
            setName("");
            setEmail("");
            setPhone("");
            setAddress("");
            fetchEmployees();
        } catch (err) {
            console.error(err);
            alert("Failed to add employee");
        }
    };

    const handleDeleteEmployee = async (id) => {
        await deleteDoc(doc(db, "employees", id));
        fetchEmployees();
    };

    return (
        <div>
            <h2>Employees</h2>
            <form onSubmit={handleAddEmployee}>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <input
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />
                <button type="submit">Add Employee</button>
            </form>

            <h3>List</h3>
            {loading
                ? "Loading..."
                : employees.map((emp) => (
                      <div key={emp.id}>
                          {emp.name} - {emp.email} - {emp.phone}
                          <button onClick={() => handleDeleteEmployee(emp.id)}>
                              Delete
                          </button>
                      </div>
                  ))}
        </div>
    );
};

export default Employee;
