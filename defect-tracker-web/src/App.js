import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Projects from "./pages/Projects";
import Employees from "./pages/Employees";
import Assignments from "./pages/Assignments";

function App() {
    return (
        <Router>
            <div>
                <nav style={{ margin: "20px" }}>
                    <Link to="/projects" style={{ marginRight: "10px" }}>
                        Projects
                    </Link>
                    <Link to="/employees" style={{ marginRight: "10px" }}>
                        Employees
                    </Link>
                    <Link to="/assignments">Assignments</Link>
                </nav>
                <Routes>
                    <Route path="/projects" element={<Projects />} />
                    <Route path="/employees" element={<Employees />} />
                    <Route path="/assignments" element={<Assignments />} />
                    <Route
                        path="*"
                        element={<h2>Welcome to Defect Tracker</h2>}
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
