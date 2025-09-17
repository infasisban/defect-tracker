import React, { useState } from "react";
import axios from "axios";
import { db } from "../firebase";
import { collection, addDoc } from "firebase/firestore";

const EmployeeForm = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [phone, setPhone] = useState("");
    const [loading, setLoading] = useState(false);

    // Generate random access code
    const generateCode = () => {
        return Math.random().toString(36).slice(-8); // 8-char code
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const employeeId = "EMP" + Date.now(); // unique ID
            const accessCode = generateCode();

            // Save to Firebase
            await addDoc(collection(db, "employees"), {
                name,
                email,
                address,
                phone,
                employeeId,
                accessCode,
                createdAt: new Date(),
            });

            // Send email via Postmark backend
            await axios.post("http://localhost:5000/send-email", {
                email,
                employeeId,
                accessCode,
                address,
                phone,
            });

            alert("Employee added and email sent successfully!");
            setName("");
            setEmail("");
            setAddress("");
            setPhone("");
        } catch (error) {
            console.error("Error adding employee:", error);
            alert("Error adding employee. Check console.");
        }

        setLoading(false);
    };

    return (
        <div className="max-w-md mx-auto mt-10 p-6 border rounded shadow">
            <h2 className="text-2xl font-bold mb-4">Add Employee</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full border p-2 rounded"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white p-2 rounded"
                >
                    {loading ? "Adding..." : "Add Employee"}
                </button>
            </form>
        </div>
    );
};

export default EmployeeForm;
