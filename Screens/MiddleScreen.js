import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  TextInput,
  Button,
} from "react-native";
import React, { useEffect, useState } from "react";
import { auth, db } from "../firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  addDoc,
} from "firebase/firestore";
import { CheckBox, Icon } from "react-native-elements";
import Toast from "react-native-toast-message";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
//GOOGLE @react-native-community/datetimepicker AND INSTALL? THEN TEST CODE

export default function MiddleScreen() {
  const [currentWeek, setCurrentWeek] = useState([]);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editingText, setEditingText] = useState("");
  ///* Nov 6 - Notification implementation - Oreilly
  //Notification/Priority States
  const [notificationTime, setNotificationTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  // */
  useEffect(() => {
    fetchTasksForDate();
  }, [selectedDate]);

  // Fetch tasks for the selected date
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
      console.log("User is not logged in - MiddleScreen.");
    }
  };

  // Calculate the current week (Sunday to Saturday)
  useEffect(() => {
    const startOfWeek = moment().startOf("week");
    const week = [];
    for (let i = 0; i < 7; i++) {
      const day = startOfWeek.clone().add(i, "days").format("YYYY-MM-DD");
      week.push(day);
    }
    setCurrentWeek(week);
  }, []);
  /* Nov 6 - Priority implementation - Oreilly WORKS!? */
  // Change task priority
  const changePriority = async (taskId, currentPriority) => {
    const newPriority = currentPriority === 3 ? 1 : currentPriority + 1;
    const user = auth.currentUser;
    const taskRef = doc(db, "Users", user.uid, "tasks", taskId);
    await updateDoc(taskRef, { priority: newPriority });
  };
  // /* Nov 6 - Notification implementation - Oreilly
  // Set notification time for a task
  const setNotification = (taskId) => {
    setSelectedTaskId(taskId);
    setShowTimePicker(true);
  };

  // Handle time picker
  // Updated onTimeChange function to save the notification time to Firestore
  const onTimeChange = async (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime && selectedTaskId !== null) {
      const user = auth.currentUser;
      const taskRef = doc(db, "Users", user.uid, "tasks", selectedTaskId);

      // Update the selected task in Firestore with the notificationTime
      await updateDoc(taskRef, { notificationTime: selectedTime });

      // Update the task list state to reflect the change
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === selectedTaskId
            ? { ...task, notificationTime: selectedTime }
            : task
        )
      );

      setSelectedTaskId(null); // Reset selected task
    }
  };

  //*/
  // Toggle completion of a task
  const toggleComplete = async (taskId, currentStatus) => {
    const user = auth.currentUser;
    const taskRef = doc(db, "Users", user.uid, "tasks", taskId);
    await updateDoc(taskRef, { completed: !currentStatus });
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    const user = auth.currentUser;
    const taskRef = doc(db, "Users", user.uid, "tasks", taskId);
    await deleteDoc(taskRef);
  };

  // Function to add a new task
  const addTask = async () => {
    const user = auth.currentUser;
    const tasksRef = collection(db, "Users", user.uid, "tasks"); // Reference to the user's tasks subcollection

    if (newTask.trim().length > 0) {
      await addDoc(tasksRef, {
        text: newTask,
        completed: false,
        date: moment().format("YYYY-MM-DD"),
        priority: 1,
      });
      setNewTask(""); // Reset the input field after adding
    } else {
      console.log("Task cannot be empty!");
      Toast.show({
        type: "error",
        text1: "Task cannot be empty!",
      });
    }
  };

  // Function to save the edited task
  const saveEditedTask = async (taskId) => {
    const user = auth.currentUser;
    const taskRef = doc(db, "Users", user.uid, "tasks", taskId); // Reference to the specific task
    await updateDoc(taskRef, {
      text: editingText,
    });
    setEditingTaskId(null); // Exit edit mode
  };
  /* Nov 6 - Notification implementation - Oreilly 
 
 Need to render/query tasks by 1.priority level 2. notificationTime 13:00 higher than 14:00.  Oreilly
 */
  // Render each task
  const renderTask = ({ item }) => (
    <View style={styles.taskItem}>
      <CheckBox
        checked={item.completed}
        onPress={() => toggleComplete(item.id, item.completed)}
        containerStyle={styles.checkbox} //Does this even work? Oreilly
      />
      {editingTaskId === item.id ? (
        <TextInput
          value={editingText}
          onChangeText={setEditingText}
          style={styles.input}
        />
      ) : (
        <Text
          style={[
            styles.taskText,
            { textDecorationLine: item.completed ? "line-through" : "none" },
          ]}
        >
          {item.text}
        </Text>
      )}
      <View style={styles.iconContainer}>
        <Icon
          name="flag"
          type="font-awesome"
          color={
            item.priority === 3
              ? "red"
              : item.priority === 2
              ? "orange"
              : "gray"
          }
          size={20}
          onPress={() => changePriority(item.id, item.priority)}
          containerStyle={styles.icon}
        />
        <Icon
          name="bell"
          type="font-awesome"
          color="#007AFF"
          size={20}
          onPress={() => setNotification(item.id)}
          containerStyle={styles.icon}
        />
        {item.notificationTime && (
          <Text style={styles.notificationText}>
            {`${item.notificationTime.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}`}
          </Text>
        )}
        {editingTaskId === item.id ? (
          <Icon
            name="check"
            type="font-awesome"
            color="#007AFF"
            size="20"
            onPress={() => saveEditedTask(item.id)}
            containerStyle={styles.icon}
          />
        ) : (
          <Icon
            name="pencil"
            type="font-awesome"
            color="#007AFF"
            size="20"
            onPress={() => {
              setEditingTaskId(item.id);
              setEditingText(item.text);
            }}
            containerStyle={styles.icon}
          />
        )}
        <Icon
          name="trash"
          type="font-awesome"
          color="red"
          size="20"
          onPress={() => deleteTask(item.id)}
          containerStyle={styles.icon}
        />
      </View>
      {showTimePicker && selectedTaskId === item.id && (
        <DateTimePicker
          value={notificationTime || new Date()}
          mode="time"
          display="default"
          onChange={onTimeChange}
        />
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Week View Row */}
      <View style={styles.weekRow}>
        {currentWeek.map((date) => (
          <TouchableOpacity
            key={date}
            style={[
              styles.dayButton,
              date === selectedDate && styles.selectedDayButton,
            ]}
            onPress={() => setSelectedDate(date)}
          >
            <Text style={styles.dayText}>{moment(date).format("ddd")}</Text>
            <Text style={styles.dateText}>{moment(date).format("D")}</Text>
          </TouchableOpacity>
        ))}
      </View>
      {/* Display Tasks for Selected Day */}
      {tasks.length > 0 ? (
        <FlatList
          data={tasks}
          keyExtractor={(item) => item.id}
          renderItem={renderTask}
        />
      ) : (
        <Text>No tasks for {moment(selectedDate).format("dddd")}</Text>
      )}

      {/* Input for adding a new task */}
      <View style={styles.addTaskContainer}>
        <TextInput
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Enter new task"
          style={styles.input}
        />
        <Button title="Add Task" onPress={addTask} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  //Calender
  container: {
    flex: 1,
    padding: 16,
  },
  weekRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  dayButton: {
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 5,
    width: 50,
  },
  selectedDayButton: {
    backgroundColor: "#007AFF",
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  //Task Container
  checkbox: {
    padding: 5,
    marginRight: 3,
    marginLeft: 3,
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    //marginRight: 10,
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    //marginLeft: 8, // adds spacing between icons and task text
    padding: 5,
  },
  //Add Task
  input: {
    flex: 1,
    fontSize: 16,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#007AFF",
  },
  addTaskContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
});
