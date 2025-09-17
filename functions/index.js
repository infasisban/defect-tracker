const functions = require('firebase-functions');
const admin = require('firebase-admin');
const sgMail = require('@sendgrid/mail');

admin.initializeApp();
sgMail.setApiKey(functions.config().sendgrid.key);

function generateTempPassword(length = 10) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$';
  let pw = '';
  for (let i = 0; i < length; i++) pw += chars[Math.floor(Math.random() * chars.length)];
  return pw;
}

exports.onEmployeeCreate = functions.firestore
  .document('employees/{empDocId}')
  .onCreate(async (snap, context) => {
    const data = snap.data();
    if (!data || !data.email) return null;

    try {
      const tempPassword = generateTempPassword(10);
      // create Firebase Auth user
      const userRecord = await admin.auth().createUser({
        email: data.email,
        password: tempPassword,
        displayName: data.name || ''
      });

      // store uid in employee doc for linkage
      await admin.firestore().collection('employees').doc(context.params.empDocId).update({
        uid: userRecord.uid
      });

      // send email via SendGrid
      const msg = {
        to: data.email,
        from: functions.config().sendgrid.from,
        subject: 'Welcome to DefectTracker — account created',
        html: `
          <p>Hello ${data.name || ''},</p>
          <p>Your account has been created for DefectTracker.</p>
          <ul>
            <li><strong>Employee doc id:</strong> ${context.params.empDocId}</li>
            <li><strong>Temporary password:</strong> ${tempPassword}</li>
          </ul>
          <p>Open the mobile app and use your email and temporary password to login. After login, set a new password.</p>
        `
      };
      await sgMail.send(msg);
      console.log('User created and email sent for', data.email);
      return null;
    } catch (err) {
      console.error('Error in onEmployeeCreate:', err);
      return null;
    }
  });
