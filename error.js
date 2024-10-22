//Need to go look at the full firebase error list

export function handleAuthError(error) {
  switch (error.code) {
    /* Login */
    case "auth/user-not-found":
      return "No user found with this email address.";
    case "auth/wrong-password":
      return "Incorrect password. Please try again.";
    /* Register */
    case "auth/email-already-in-use":
      return "This email address is already in use.";
    case "auth/invalid-email":
      return "This email address is not valid.";
    case "auth/email-already-exists":
      return "The provided email is already in use by an existing user. Each user must have a unique email.";
    //Password
    case "auth/weak-password":
      return "Password is too weak. Please use a stronger password.";
    case "auth/missing-password":
      return "Enter a password.";
    case "auth/too-many-requests":
      return "Access to this account has been temporarily disabled due to many failed login attempts. You can immediately restore it by resetting your password or you can try again later.";
    //auth/invalid-credential

    default:
      return "An unknown error occurred. Please try again.";
  }
}
