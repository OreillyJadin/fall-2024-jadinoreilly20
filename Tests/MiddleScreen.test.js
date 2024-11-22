import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MiddleScreen from "../Screens/MiddleScreen";
import { auth, db } from "../firebase";
import moment from "moment";

describe("MiddleScreen Component", () => {
  // Week View Rendering GOOD
  it("renders the week view correctly", () => {
    const { getByText } = render(<MiddleScreen />);
    expect(getByText("Sun")).toBeTruthy();
    expect(getByText("Mon")).toBeTruthy();
    expect(getByText("Tue")).toBeTruthy();
    expect(getByText("Wed")).toBeTruthy();
    expect(getByText("Thu")).toBeTruthy();
    expect(getByText("Fri")).toBeTruthy();
    expect(getByText("Sat")).toBeTruthy();
  });
  //Adding a Task FAILED
  it("allows adding a task", async () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <MiddleScreen />
    );

    // Input new task
    const input = getByPlaceholderText("Enter new task");
    const addButton = getByText("Add Task");

    fireEvent.changeText(input, "Test Task");
    fireEvent.press(addButton);

    // Check if the task is added
    await waitFor(() =>
      expect(getAllByText("Test Task").length).toBeGreaterThan(0)
    );
  });

  //GOOD
  it("shows no tasks message when there are no tasks", () => {
    const { getByText } = render(<MiddleScreen />);

    // Check for "No tasks" message
    expect(getByText(/No tasks for/i)).toBeTruthy();
  });

    //FAILED
  it("allows marking a task as complete", async () => {
    const { getByPlaceholderText, getByText, getAllByRole } = render(
      <MiddleScreen />
    );

    // Add a task first
    const input = getByPlaceholderText("Enter new task");
    const addButton = getByText("Add Task");

    fireEvent.changeText(input, "Task to Complete");
    fireEvent.press(addButton);

    // Check for the checkbox
    //Looking into where our task actually is
    await waitFor(() => {
      const checkboxes = getAllByRole("checkbox");
      fireEvent.press(checkboxes[0]);

      // Checkbox works?
      expect(checkboxes[0].props.accessibilityState.checked).toBeTruthy();
    });
  });

//FAILED
  it("allows deleting a task", async () => {
    const { getByPlaceholderText, getByText, queryByText } = render(
      <MiddleScreen />
    );

    // Add a task first
    const input = getByPlaceholderText("Enter new task");
    const addButton = getByText("Add Task");

    fireEvent.changeText(input, "Task to Delete");
    fireEvent.press(addButton);

    // Delete the task
    const deleteButton = getByText("Task to Delete").parent.find(
      (node) => node.type === "Icon" && node.props.name === "trash"
    );
    fireEvent.press(deleteButton);

    // Check if the task is deleted
    await waitFor(() => expect(queryByText("Task to Delete")).toBeNull());
  });
});
