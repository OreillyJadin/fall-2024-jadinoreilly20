import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import MiddleScreen from "../Screens/MiddleScreen";
import { auth, db } from "../firebase";
import moment from "moment";

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

//GOOD
it("shows no tasks message when there are no tasks", () => {
  const { getByText } = render(<MiddleScreen />);

  // Check for "No tasks" message
  expect(getByText(/No tasks for/i)).toBeTruthy();
});


