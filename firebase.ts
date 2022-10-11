import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { Macbook } from './crawler';

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(require('./macbook-finder-firebase-adminsdk-fgnqf-2cb1ae7eb7.json'))
});

const db = admin.firestore();

export const saveMacbooks = (dataArray: Macbook[]) => {
  const date = new Date();
  const currDate = `${date.getDate()}-${date.getMonth()}-${date.getFullYear()}`;

  db.collection('Macbooks').doc(currDate)
  .set({
    macbooks: JSON.stringify(dataArray),
    created: admin.firestore.FieldValue.serverTimestamp()
  })
  .then(() => console.log("Saved data succesfully"))
  .catch((err) => console.log(err));
};

export const getMacbooks = async () => {
  const macbooksRef = db.collection('Macbooks');
  let snapshot = await macbooksRef.orderBy('created', 'desc').limit(1).get();
  let macbookData;
  
  snapshot.forEach((doc) => {
    macbookData = doc.data();
  });
  
  return macbookData;
}
