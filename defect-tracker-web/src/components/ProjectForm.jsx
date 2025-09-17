import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

const ProjectForm = ({ fetchProjects }) => {
    const [projectID, setProjectID] = useState("");
    const [projectName, setProjectName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await addDoc(collection(db, "projects"), {
            projectID,
            projectName,
            description,
        });
        setProjectID("");
        setProjectName("");
        setDescription("");
        fetchProjects();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                placeholder="Project ID"
                value={projectID}
                onChange={(e) => setProjectID(e.target.value)}
                required
            />
            <input
                placeholder="Project Name"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                required
            />
            <input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <button type="submit">Add Project</button>
        </form>
    );
};

export default ProjectForm;
