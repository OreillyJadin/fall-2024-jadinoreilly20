import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import RegisterScreen from "../Screens/RegisterScreen";

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

test("renders RegisterScreen correctly", () => {
  const { getByText } = render(<RegisterScreen navigation={navigationMock} />);
  expect(getByText("Create an account")).toBeTruthy();
});

it("renders the Register screen with inputs and button", () => {
  const { getByPlaceholderText, getByText } = render(
    <RegisterScreen navigation={navigationMock} />
  );

  // Check input placeholders
  expect(getByPlaceholderText("Full Name")).toBeTruthy();
  expect(getByPlaceholderText("Email")).toBeTruthy();
  expect(getByPlaceholderText("Password")).toBeTruthy();

  // Check button
  expect(getByText("Register")).toBeTruthy();
});

it("allows user to type into input fields", () => {
  const { getByPlaceholderText } = render(
    <RegisterScreen navigation={navigationMock} />
  );

  const nameInput = getByPlaceholderText("Full Name");
  const emailInput = getByPlaceholderText("Email");
  const passwordInput = getByPlaceholderText("Password");

  // Simulate typing
  fireEvent.changeText(nameInput, "John Doe");
  fireEvent.changeText(emailInput, "johndoe@example.com");
  fireEvent.changeText(passwordInput, "password123");

  // Verify input values
  expect(nameInput.props.value).toBe("John Doe");
  expect(emailInput.props.value).toBe("johndoe@example.com");
  expect(passwordInput.props.value).toBe("password123");
});
//---------------- Calls handleRegister when Register button is pressed ---------

//---------------- Navigates to Login when back(Login) button is pressed ---------
