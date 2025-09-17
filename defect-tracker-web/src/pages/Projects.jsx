import React, { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import ProjectForm from "../components/ProjectForm";

const Projects = () => {
    const [projects, setProjects] = useState([]);

    const fetchProjects = async () => {
        const snapshot = await getDocs(collection(db, "projects"));
        setProjects(
            snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
        );
    };

    const deleteProject = async (id) => {
        await deleteDoc(doc(db, "projects", id));
        fetchProjects();
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    return (
        <div>
            <h1>Projects</h1>
            <ProjectForm fetchProjects={fetchProjects} />
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Description</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {projects.map((p) => (
                        <tr key={p.id}>
                            <td>{p.projectID}</td>
                            <td>{p.projectName}</td>
                            <td>{p.description}</td>
                            <td>
                                <button onClick={() => deleteProject(p.id)}>
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Projects;
