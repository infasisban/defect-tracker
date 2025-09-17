/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const { setGlobalOptions } = require("firebase-functions");
const { onRequest } = require("firebase-functions/https");
const logger = require("firebase-functions/logger");

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const nodemailer = require("nodemailer");

admin.initializeApp();

// Configure Gmail (or other SMTP)
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "infasisban777@gmail.com", // replace with sender email
        pass: "YOUR_APP_PASSWORD", // use App Password if 2FA enabled
    },
});

// Trigger: New Employee Added
exports.sendWelcomeEmail = functions.firestore
    .document("employees/{employeeId}")
    .onCreate(async (snap, context) => {
        const employee = snap.data();
        const mailOptions = {
            from: "YOUR_EMAIL@gmail.com",
            to: employee.email,
            subject: "Welcome to Defect Tracker",
            text: `Hi ${employee.name},\nYour Employee ID is: ${employee.employeeID}\nLogin here: [App Link]`,
        };
        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${employee.email}`);
    });

// Trigger: New Project Assignment
exports.sendAssignmentEmail = functions.firestore
    .document("assignments/{assignmentId}")
    .onCreate(async (snap, context) => {
        const assignment = snap.data();

        // Get employee email
        const employeeDoc = await admin
            .firestore()
            .collection("employees")
            .where("employeeID", "==", assignment.employeeID)
            .get();

        if (!employeeDoc.empty) {
            const employee = employeeDoc.docs[0].data();
            const mailOptions = {
                from: "YOUR_EMAIL@gmail.com",
                to: employee.email,
                subject: "New Project Assignment",
                text: `Hi ${employee.name},\nYou have been assigned to project: ${assignment.projectID}\nRole: ${assignment.role}`,
            };
            await transporter.sendMail(mailOptions);
            console.log(`Assignment email sent to ${employee.email}`);
        }
    });
