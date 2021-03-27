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
    currentSchedule: "",
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

  // const userRef = db().collection('users').doc(uid);

  const newSchedule = {
    createDate: db.FieldValue.serverTimestamp(),
    user: uid,
    weblist: ['google.com','schoology.com']
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
    endTime: data.startTime + data.duration
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
  var today = new Date();
  var beginningOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
  // .setHours(0, 0, 0, 0);
  // var beginningOfToday = new Date().setHours(0)
  const scheduleRef = db().collection('schedules')
    .where('user', '==', user)
    .where('createDate', ">=", beginningOfToday);
  const scheduleSnapshot = await scheduleRef.get();

  if (scheduleSnapshot.empty) {
    return res.status(200).json({
      periods: [],
      exists: false,
      no_of_periods: scheduleSnapshot.size
    })
  }

  console.log("got past empty schedule");

  const userRef = db().collection('users').doc(user);

  console.log(scheduleRef)

  const scheduleId = scheduleSnapshot.docs[0].id

  userRef.update({
    currentSchedule: scheduleSnapshot.docs[0].id
  });

  const responseJson = {
    periods: {},
    exists: true
  }

  let periods: any[] = [];

  const periodsRef = db().collection('periods').where('schedule', '==', scheduleId);

  periodsRef.get().then((value) => {
    value.forEach((doc: any) => {
      const withIds = doc.data();
      withIds.id = doc.id;
      periods.push(withIds);
    })
    responseJson.periods = periods;
    res.status(200).json(responseJson);
  }).catch(() => {
    res.status(200).json({
      exists: false,
      error: "Query Unsuccessful"
    })
  })
});

export const updateCurrentSchedule = functions.https.onRequest(async (req: any, res: any) => {
  let user = req.body.uid;
  const scheduleRef = db().collection('schedules').where("createDate", ">=", new Date().setHours(0, 0, 0))./*where('user', '==', user).*/limit(1);
  const snapshot = await scheduleRef.get();

  if (snapshot.empty) {
    return res.status(200).json({
      periods: [],
      exists: false
    })
  }

  const userRef = db().collection('users').doc(user);

  userRef.update({ currentSchedule: scheduleRef });
});

export const getNiceWebsites = functions.https.onRequest(async (req: any, res: any) => {
  let userId = req.body.uid;
  const userRef = db().collection('users').doc(userId)
  const userSnapshot = await userRef.get();

  if (userSnapshot.exists) {
    const scheduleRef = db().collection('schedules').doc(userSnapshot.get('currentSchedule'));
    const scheduleSnapshot = await scheduleRef.get();
    if (scheduleSnapshot.exists) {
      if (scheduleSnapshot.get("weblist") != null) {
        return res.status(200).json({
          nice_websites: scheduleSnapshot.get("weblist")
        })
      }
      else {
        return res.status(200).json({
          nice_websites: [],
          error: "looks like there's no weblist!"
        });
      }
    } else {
      return res.status(200).json({
        nice_websites: [],
        error: "looks like there's no schedule!"
      });
    }
  }
  else {
    return res.status(200).json({
      nice_websites: [],
      error: "looks like there's no user!"
    });
  }
});

// export const addNiceWebsite = 

// export const getCurrentPeriod = functions.https.onRequest(async (req: any, res: any) => {
//   let scheduleUid = req.body.uid;
//   const scheduleRef = db().collection('schedules').doc(scheduleUid);
//   const scheduleSnapshot = await scheduleRef.get();

//   if (scheduleSnapshot.exists) {
//     return res.status(200).json({
//       periods: [],
//       exists: false
//     })
//   }

//   console.log("got past empty schedule");

//   const userRef = db().collection('users').doc(user);

//   console.log(scheduleRef)

//   const scheduleId = scheduleSnapshot.docs[0].id

//   userRef.update({ 
//     currentSchedule: scheduleSnapshot.docs[0].id
//   });

//   const responseJson = {
//     periods: {},
//     exists: true
//   }

//   let periods: any[] = [];

//   const periodsRef = db().collection('periods').where('schedule', '==', scheduleId);

//   periodsRef.get().then((value) => {
//     value.forEach((doc: any) => {
//       const withIds = doc.data();
//       withIds.id = doc.id;
//       periods.push(withIds);
//     })
//     responseJson.periods = periods;
//     res.status(200).json(responseJson);
//   }).catch(() => {
//     res.status(200).json({
//       exists: false,
//       error: "Query Unsuccessful"
//     })
//   })
// })