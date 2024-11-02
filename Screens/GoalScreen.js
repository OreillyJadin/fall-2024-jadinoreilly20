import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import { collection, query, where, onSnapshot, doc } from "firebase/firestore";
import { CheckBox, Icon } from "react-native-elements";
import moment from "moment";

export default function GoalScreen() {
  const [currentDate, setCurrentDate] = useState(moment());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [taskCounts, setTaskCounts] = useState({});

  useEffect(() => {
    generateCalendar();
    fetchMonthlyTasks();
  }, [currentDate]);

  // Update tasks whenever selectedDate changes
  useEffect(() => {
    fetchTasksForDate();
  }, [selectedDate]);

  const generateCalendar = () => {
    const startOfMonth = currentDate.clone().startOf("month");
    const endOfMonth = currentDate.clone().endOf("month");
    const calendarDays = [];
    let day = startOfMonth.clone().startOf("week");

    while (day.isBefore(endOfMonth, "day") || day.weekday() !== 0) {
      calendarDays.push(day.clone());
      day.add(1, "day");
    }
    setDaysInMonth(calendarDays);
  };

  const fetchMonthlyTasks = () => {
    const user = auth.currentUser;
    if (user) {
      // Fetch tasks from the previous month and the next month to fit calendar screen
      const monthStart = currentDate
        .clone()
        .startOf("month")
        .subtract(7, "days")
        .format("YYYY-MM-DD");
      const monthEnd = currentDate
        .clone()
        .endOf("month")
        .add(7, "days")
        .format("YYYY-MM-DD");

      const tasksQuery = query(
        collection(db, "Users", user.uid, "tasks"),
        where("date", ">=", monthStart),
        where("date", "<=", monthEnd)
      );

      onSnapshot(tasksQuery, (querySnapshot) => {
        const fetchedTasks = {};
        querySnapshot.docs.forEach((doc) => {
          const task = doc.data();
          const date = task.date;
          if (!fetchedTasks[date]) {
            fetchedTasks[date] = { total: 0, completed: 0 };
          }
          fetchedTasks[date].total += 1;
          if (task.completed) fetchedTasks[date].completed += 1;
        });
        setTaskCounts(fetchedTasks);
      });
    }
  };

  const fetchTasksForDate = () => {
    const user = auth.currentUser;
    if (user) {
      const tasksQuery = query(
        collection(db, "Users", user.uid, "tasks"),
        where("date", "==", selectedDate)
      );
      onSnapshot(tasksQuery, (querySnapshot) => {
        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
      });
    } else {
      console.log("User is not logged in.");
    }
  };

  const getDayColor = (date) => {
    const dayString = date.format("YYYY-MM-DD");
    if (!taskCounts[dayString]) return "#FFFFFF"; // No tasks

    const { total, completed } = taskCounts[dayString];
    const completionRate = completed / total;

    if (completionRate === 1) return "#4CAF50"; // All tasks completed (green)
    if (completionRate >= 0.5) return "#FFD700"; // Half or more completed (yellow)
    return "#FF6347"; // Less than half completed (red)
  };

  return (
    <View style={styles.container}>
      <View style={styles.monthHeader}>
        <Icon
          name="arrow-left"
          type="font-awesome"
          onPress={() =>
            setCurrentDate((prev) => prev.clone().subtract(1, "month"))
          }
        />
        <Text style={styles.monthText}>{currentDate.format("MMMM YYYY")}</Text>
        <Icon
          name="arrow-right"
          type="font-awesome"
          onPress={() => setCurrentDate((prev) => prev.clone().add(1, "month"))}
        />
      </View>

      <View style={styles.weekDaysContainer}>
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Text key={day} style={styles.weekDayText}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.monthContainer}>
        {daysInMonth.map((day) => (
          <TouchableOpacity
            key={day.format("YYYY-MM-DD")}
            style={[
              styles.dayContainer,
              { backgroundColor: getDayColor(day) },
              day.format("YYYY-MM-DD") === moment().format("YYYY-MM-DD") &&
                styles.currentDay,
              day.format("YYYY-MM-DD") === selectedDate && styles.selectedDay,
            ]}
            onPress={() => setSelectedDate(day.format("YYYY-MM-DD"))}
          >
            <Text style={styles.dayText}>{day.format("D")}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.taskItem}>
              <CheckBox
                checked={item.completed}
                onPress={() => toggleComplete(item.id, item.completed)}
              />
              <Text style={styles.taskText}>{item.text}</Text>
              <Icon
                name="trash"
                type="font-awesome"
                onPress={() => deleteTask(item.id)}
              />
            </View>
          )}
        />
      ) : (
        <Text>No tasks for {moment(selectedDate).format("MMMM D")}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  monthHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 5,
  },
  weekDayText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  monthContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
  },
  dayContainer: {
    width: "13%",
    alignItems: "center",
    padding: 8,
    marginVertical: 5,
  },
  currentDay: {
    backgroundColor: "#007AFF",
    borderRadius: 15,
  },
  selectedDay: {
    backgroundColor: "#ADD8E6",
    borderRadius: 15,
  },
  dayText: {
    fontSize: 16,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
  },
});

/*
const fetchTasksForDate = () => {
    const user = auth.currentUser;
    if (user) {
      const tasksQuery = query(
        collection(db, "Users", user.uid, "tasks"),
        where("date", "==", selectedDate)
      );
      onSnapshot(tasksQuery, (querySnapshot) => {
        const fetchedTasks = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(fetchedTasks);
      });
    } else {
      console.log("User is not logged in.");
    }
  };

  useEffect(() => {
    fetchTasksForDate();
  }, [selectedDate]); */
