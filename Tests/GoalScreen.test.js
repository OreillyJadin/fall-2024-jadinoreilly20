import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import GoalScreen from "../Screens/GoalScreen";
import moment from "moment";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

jest.mock("../firebase", () => ({
  auth: {
    currentUser: { uid: "testUserId" },
  },
  db: {},
}));

jest.mock("../components/useStreak", () => jest.fn(() => 5));

it("renders header with streak", () => {
  const { getByText } = render(<GoalScreen />);
  expect(getByText("Progress")).toBeTruthy();
  expect(getByText("🔥 5")).toBeTruthy();
});

it("displays month navigation", () => {
  const { getByText } = render(<GoalScreen />);
  expect(getByText(moment().format("MMMM YYYY"))).toBeTruthy();
});

it("navigates to the previous month", () => {
  const { getByText, getByRole } = render(<GoalScreen />);
  const leftArrow = getByRole("button", { name: "arrow-left" });

  fireEvent.press(leftArrow);
  expect(
    getByText(moment().subtract(1, "month").format("MMMM YYYY"))
  ).toBeTruthy();
});

it("navigates to the next month", () => {
  const { getByText, getByRole } = render(<GoalScreen />);
  const rightArrow = getByRole("button", { name: "arrow-right" });

  fireEvent.press(rightArrow);
  expect(getByText(moment().add(1, "month").format("MMMM YYYY"))).toBeTruthy();
});

it("highlights the selected day", () => {
  const { getByTestId } = render(<GoalScreen />);
  const targetDay = moment().add(1, "day").format("YYYY-MM-DD");
  const targetDayElement = getByTestId(`day-${targetDay}`); // Use the testID

  fireEvent.press(targetDayElement);

  expect(targetDayElement.props.style.backgroundColor).toBe("#ADD8E6");
});

it("displays no tasks message when no tasks for date", async () => {
  const { getByText } = render(<GoalScreen />);
  await waitFor(() => {
    expect(getByText(/No tasks for/)).toBeTruthy();
  });
});

// ---------------- Calendar loads in ( Sun - Sat ) ---------
it("displays days of the week in order (Sun - Sat)", () => {
  const { getByText } = render(<GoalScreen />);
  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  daysOfWeek.forEach((day) => {
    expect(getByText(day)).toBeTruthy();
  });
});

// ---------------- theres 7 x 5 days ---------
it("displays a 7x5 grid of days", () => {
  const { getAllByTestId } = render(<GoalScreen />);
  const dayElements = getAllByTestId(/day-/); // Use testID for all days
  expect(dayElements.length).toBe(35); // 7 days x 5 rows
});
