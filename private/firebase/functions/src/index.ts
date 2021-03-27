import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

const cors = require('cors')({ origin: true });


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
    currentSchedule:"",
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

  userRef.update({ inSession: true }).then(() => {
    return res.status(200).json({
      result: "success"
    })
  }).catch((errorMsg) => {
    return res.status(200).json({
      result: "failure",
      error: errorMsg
    })
  });

})

export const exitSession = functions.https.onRequest(async (req: any, res: any) => {
  const userRef = db().collection('users').doc(req.body.uid);

  userRef.update({ inSession: false }).then(() => {
    return res.status(200).json({
      result: "success"
    })
  }).catch((errorMsg) => {
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

exports.getSchedule = functions.https.onCall((data, context) => {
  cors(data, context, async () => {
    const sampleEvent = (await db().collection('schedules').doc('samplePeriod').get())
    return sampleEvent.data;
  });
});

export const getCurrentSchedule = functions.https.onRequest(async (req: any, res: any) => {
  let user = req.body.uid;
  const scheduleRef = db().collection('schedules').where("event_time", ">=", new Date().setHours(0,0,0)).where('user', '==', user).limit(1);
  const snapshot = await scheduleRef.get();

  if (snapshot.empty){
    return res.status(200).json({
      periods:[],
      exists:false
    })
  }
  
  console.log("got past empty schedule");

  const userRef = db().collection('users').doc(user);

  userRef.update({currentSchedule: scheduleRef});

  const responseJson = { 
    periods:{},
    exists: true
   }

  let periods: any[] = [];

  const periodsRef = db().collection('periods').where('schedule','==',scheduleRef);

  periodsRef.get().then((value)=>{
    value.forEach((doc: any) => {
      const withIds = doc.data();
      withIds.id = doc.id;
      periods.push(withIds);
    })
    responseJson.periods = periods;
    res.status(200).json(responseJson);
  }).catch(()=>{
    res.status(200).json({
      exists: false,
      error: "Query Unsuccessful"
    })
  })
});

export const updateCurrentSchedule = functions.https.onRequest(async (req: any, res: any) => {
  let user = req.body.uid;
  const scheduleRef = db().collection('schedules').where("event_time", ">=", new Date().setHours(0,0,0)).where('user', '==', user).limit(1);
  const snapshot = await scheduleRef.get();

  if (snapshot.empty){
    return res.status(200).json({
      periods:[],
      exists:false
    })
  }
  
  const userRef = db().collection('users').doc(user);

  userRef.update({currentSchedule: scheduleRef});
});