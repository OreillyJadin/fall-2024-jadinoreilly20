import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { Icon } from "react-native-elements";

export const RecurringOverlay = ({ isVisible, onClose, onSave }) => {
  const [selectedOption, setSelectedOption] = useState("");

  const options = ["Daily", "Weekly", "Bi-Weekly", "Monthly", "None"];

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true}>
      <View style={styles.overlayContainer}>
        <View style={styles.overlayContent}>
          <Text style={styles.overlayTitle}>Set Recurring Options</Text>

          {options.map((option) => (
            <TouchableOpacity
              key={option}
              onPress={() => setSelectedOption(option)}
              style={[
                styles.optionContainer,
                selectedOption === option && styles.optionSelected,
              ]}
            >
              <Text
                style={[
                  styles.optionText,
                  selectedOption === option && styles.optionTextSelected,
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}

          <View style={styles.buttonContainer}>
            <Button title="Cancel" onPress={onClose} />
            <Button
              title="Save"
              onPress={() => onSave(selectedOption)}
              disabled={!selectedOption}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  overlayContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  overlayTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  optionContainer: {
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    alignItems: "center",
  },
  optionSelected: {
    backgroundColor: "#007AFF",
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 16,
  },
  optionTextSelected: {
    color: "#fff",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
});
