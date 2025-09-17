import React, { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const Assignments = () => {
    const [projects, setProjects] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [projectID, setProjectID] = useState("");
    const [employeeID, setEmployeeID] = useState("");
    const [role, setRole] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            const snapshot = await getDocs(collection(db, "projects"));
            setProjects(
                snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );
        };
        const fetchEmployees = async () => {
            const snapshot = await getDocs(collection(db, "employees"));
            setEmployees(
                snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
            );
        };
        fetchProjects();
        fetchEmployees();
    }, []);

    const addAssignment = async () => {
        if (!projectID || !employeeID || !role)
            return alert("⚠️ Fill all fields");

        // Get selected employee data
        const employee = employees.find((e) => e.id === employeeID);
        if (!employee) return alert("Employee not found");

        await addDoc(collection(db, "assignments"), {
            projectID,
            projectName:
                projects.find((p) => p.id === projectID)?.projectName || "",
            employeeID,
            employeeEmail: employee.email,
            employeeName: employee.name,
            role,
            assignedAt: new Date(),
        });

        alert("Project assigned successfully");
        setProjectID("");
        setEmployeeID("");
        setRole("");
    };

    return (
        <div>
            <h1>Assign Projects</h1>

            <select
                value={projectID}
                onChange={(e) => setProjectID(e.target.value)}
            >
                <option value="">Select Project</option>
                {projects.map((p) => (
                    <option key={p.id} value={p.id}>
                        {p.projectName}
                    </option>
                ))}
            </select>

            <select
                value={employeeID}
                onChange={(e) => setEmployeeID(e.target.value)}
            >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>
                        {emp.name}
                    </option>
                ))}
            </select>

            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option>Frontend</option>
                <option>Backend</option>
                <option>Full Stack</option>
                <option>UI Design</option>
                <option>UX Design</option>
            </select>

            <button onClick={addAssignment}>Assign</button>
        </div>
    );
};

export default Assignments;
