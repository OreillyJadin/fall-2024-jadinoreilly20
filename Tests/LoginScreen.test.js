import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import LoginScreen from "../Screens/LoginScreen";

/*
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    setOptions: jest.fn(),
  }),
}));
*/

const mockSetOptions = jest.fn();

const navigationMock = {
  setOptions: mockSetOptions,
};

test("renders LoginScreen correctly", () => {
  const { getByText } = render(<LoginScreen navigation={navigationMock} />);
  expect(getByText("Login with your credentials")).toBeTruthy();
});

it("renders the Login screen with inputs and button", () => {
  const { getByPlaceholderText, getByText } = render(
    <LoginScreen navigation={navigationMock} />
  );

  // Check input placeholders
  expect(getByPlaceholderText("Email")).toBeTruthy();
  expect(getByPlaceholderText("Password")).toBeTruthy();

  // Check button
  expect(getByText("Login")).toBeTruthy();
  expect(getByText("Register")).toBeTruthy();
});

it("allows user to type into input fields", () => {
  const { getByPlaceholderText } = render(
    <LoginScreen navigation={navigationMock} />
  );

  const emailInput = getByPlaceholderText("Email");
  const passwordInput = getByPlaceholderText("Password");

  // Simulate typing
  fireEvent.changeText(emailInput, "johndoe@example.com");
  fireEvent.changeText(passwordInput, "password123");

  // Verify input values
  expect(emailInput.props.value).toBe("johndoe@example.com");
  expect(passwordInput.props.value).toBe("password123");
});
//---------------- Calls hanldeLogin when Login button is pressed ---------

//---------------- Navigates to Register when Register button is pressed ---------
