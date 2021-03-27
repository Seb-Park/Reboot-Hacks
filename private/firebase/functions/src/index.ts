import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

function getFormattedDate(){
    let d = new Date();
    
    let date_formatted = d.getFullYear() + "-" + ('0' + (d.getMonth() + 1)).slice(-2) + "-" + ('0' + d.getDate()).slice(-2) + " " + ('0' + d.getHours()).slice(-2) + ":" + ('0' + d.getMinutes()).slice(-2) + ":" + ('0' + d.getSeconds()).slice(-2);

    return date_formatted;
}

exports.createUser = functions.auth.user().onCreate(async(user) => {
    const newUser = {
        email: user.email,
        createDate: admin.firestore.FieldValue.serverTimestamp(),
        username: user.email?.substring(0, user.email?.indexOf('@'))
    }

    const userRef = admin.firestore().collection('users');

    await userRef.doc(String(user.uid)).set(newUser);

    console.log(`${getFormattedDate()} - [* createUser *] :: Created user ${newUser.username}`);
})