import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp()
var db = admin.firestore

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//   functions.logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

function getFormattedDate() {
  const d = new Date();

  const dateFormatted = d.getFullYear() + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2) + " "
    + ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2) + ":" + ("0" + d.getSeconds()).slice(-2);

  return dateFormatted;
}

// user endpoints

exports.createUser = functions.auth.user().onCreate(async (user) => {
  const newUser = {
    email: user.email,
    createDate: db.FieldValue.serverTimestamp(),
    inSession: false,
    username: user.email?.substring(0, user.email?.indexOf("@")),
  }

  const userRef = db().collection("users");

  await userRef.doc(String(user.uid)).set(newUser);

  console.log(`${getFormattedDate()} :: Created user ${newUser.username}`);
})

// chrome extension endpoints

export const checkSession = functions.https.onRequest(async (req: any, res: any) => {
  const userRef = db().collection('users').doc(req.body.uid);

  const doc = await userRef.get();
  if (!doc.exists) {
    res.status(200).json({
      result: false,
      error: "Doc does not exist."
    })
  } else {
    res.status(200).json({
      result: doc.get("inSession"),
      error: "none"
    })
  }
})

export const enterSession = functions.https.onRequest(async (req: any, res: any) => {
  const userRef = db().collection('users').doc(req.body.uid);

  userRef.update({inSession: true}).then(() => {
    return res.status(200).json({
      result: "success"
    })
  }).catch((errorMsg)=>{
    return res.status(200).json({
      result: "failure",
      error: errorMsg
    })
  });

})

export const exitSession = functions.https.onRequest(async (req: any, res: any) => {
  const userRef = db().collection('users').doc(req.body.uid);

  userRef.update({inSession: false}).then(() => {
    return res.status(200).json({
      result: "success"
    })
  }).catch((errorMsg)=>{
    return res.status(200).json({
      result: "failure",
      error: errorMsg
    })
  });
})

// reactjs endpoints
exports.createSchedule = functions.https.onCall((data, context) => {
  const uid = context.auth?.uid!

  const userRef = db().collection('users').doc(uid);

  const newSchedule = {
    createDate: db.FieldValue.serverTimestamp(),
    user: userRef,
  };

  db().collection('schedules').doc().set(newSchedule);
});

exports.createEvent = functions.https.onCall(async (data, context) => {
  const uid = context.auth?.uid!

  const userRef = db().collection('users').doc(uid);
  const scheduleRef = (await userRef.get()).get("currentSchedule")

  const newEvent = {
    createDate: db.FieldValue.serverTimestamp(),
    schedule: scheduleRef,
    name: data.name,
    startTime: data.startTime,
    duration: data.duration,
  };

  db().collection('periods').doc().set(newEvent)
});

exports.getSchedule = functions.https.onCall(async (data, context) => {
  return {
    data: {
      duration: "fuck yo chicken strips"
    }
  }
});
