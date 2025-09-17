import express from "express";
import bodyParser from "body-parser";
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import cors from "cors";
import nodemailer from "nodemailer";

// Firebase setup
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
};
const appFirebase = initializeApp(firebaseConfig);
const db = getFirestore(appFirebase);

// Nodemailer setup
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "www.infas7771@gmail.com",
        pass: "gpmm vjmv kkkj ngxv", // Gmail app password
    },
});

const app = express();
app.use(bodyParser.json());
app.use(cors());
const PORT = 5000;

// Generate 6-digit access code as string
function generateAccessCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

// Add employee route
app.post("/add-employee", async (req, res) => {
    try {
        const { name, email, phone, address } = req.body;
        if (!name || !email || !phone || !address)
            return res.status(400).json({ error: "All fields are required" });

        const accessCode = generateAccessCode();

        // Store in Firestore
        const docRef = await addDoc(collection(db, "employees"), {
            name,
            email: email.toLowerCase(),
            phone,
            address,
            accessCode,
            createdAt: new Date(),
        });

        // Send email
        await transporter.sendMail({
            from: `"Defect Tracker" <www.infas7771@gmail.com>`,
            to: email,
            subject: "Your Employee Access Code",
            text: `Hello ${name},\n\nEmployee ID: ${docRef.id}\nAccess Code: ${accessCode}\n\nUse this to login to the mobile app.`,
        });

        res.json({
            message: "Employee added & email sent!",
            employeeId: docRef.id,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add employee" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
