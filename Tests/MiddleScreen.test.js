// Tests/MiddleScreen.test.js
/*
import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MiddleScreen from "../Screens/MiddleScreen"; // Adjust this path as needed
import { auth, db } from "../firebase"; // Mock firebase as needed
import moment from "moment";

jest.mock("../firebase", () => ({
  auth: { currentUser: { uid: "testUser" } },
  db: jest.fn(),
}));

describe("MiddleScreen", () => {
  it("renders correctly with initial state", () => {
    const { getByText } = render(<MiddleScreen />);
    expect(getByText(`No tasks for ${moment().format("dddd")}`)).toBeTruthy();
  });

  it("displays tasks for selected day", async () => {
    const { getByText } = render(<MiddleScreen />);
    await waitFor(() => expect(getByText("Task 1")).toBeTruthy());
  });

  it("adds a new task", async () => {
    const { getByPlaceholderText, getByText } = render(<MiddleScreen />);
    const input = getByPlaceholderText("Enter new task");
    fireEvent.changeText(input, "New Task");
    fireEvent.press(getByText("Add Task"));
    await waitFor(() => expect(getByText("New Task")).toBeTruthy());
  });

  it("deletes a task", async () => {
    const { getByText, queryByText } = render(<MiddleScreen />);
    fireEvent.press(getByText("Delete"));
    await waitFor(() => expect(queryByText("Task 1")).toBeNull());
  });

  it("toggles task completion", async () => {
    const { getByTestId } = render(<MiddleScreen />);
    const checkbox = getByTestId("checkbox-task1");
    fireEvent.press(checkbox);
    await waitFor(() => expect(checkbox.props.checked).toBe(true));
  });

  it("changes task priority", async () => {
    const { getByTestId } = render(<MiddleScreen />);
    const priorityButton = getByTestId("priority-task1");
    fireEvent.press(priorityButton);
    await waitFor(() => expect(priorityButton.props.color).toBe("orange"));
  });

  it("sets notification time for a task", async () => {
    const { getByText, getByTestId } = render(<MiddleScreen />);
    fireEvent.press(getByText("Set Notification"));
    fireEvent(getByTestId("time-picker"), "onChange", {
      nativeEvent: { timestamp: new Date() },
    });
    await waitFor(() => expect(getByText(/Time Set/)).toBeTruthy());
  });
});
*/