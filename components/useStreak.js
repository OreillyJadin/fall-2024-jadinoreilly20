import { doc, getDoc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";
import moment from "moment";
import { useEffect, useState } from "react";

function useStreak() {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    const updateStreak = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "Users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          const lastActiveDate = moment(
            userData.lastActiveDate?.toDate()
          ).format("DD-MM-YYYY");
          const today = moment().format("DD-MM-YYYY");

          if (lastActiveDate) {
            const difference = moment(today, "DD-MM-YYYY").diff(
              moment(lastActiveDate, "DD-MM-YYYY"),
              "days"
            );
            if (difference === 1) {
              //If user logs in next day
              // Increment streak
              setStreak(userData.streak + 1);
              await setDoc(
                userDoc,
                {
                  streak: userData.streak + 1,
                  lastActiveDate: new Date(),
                },
                { merge: true }
              );
            } else if (difference > 1) {
              // Reset streak if the gap is more than one day
              setStreak(1);
              await setDoc(
                userDoc,
                {
                  streak: 1,
                  lastActiveDate: new Date(),
                },
                { merge: true }
              );
            } else {
              setStreak(userData.streak);
            }
          } else {
            // First-time user or a user without streak history
            setStreak(1);
            await setDoc(
              userDoc,
              {
                streak: 1,
                lastActiveDate: new Date(),
              },
              { merge: true }
            );
          }
        }
      }
    };
    updateStreak();
  }, []);

  return streak;
}

export default useStreak;
