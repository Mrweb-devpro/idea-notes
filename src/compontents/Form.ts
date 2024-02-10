import {
  signupEmailInp,
  siginupPasswordInp,
  LoginPasswordInp,
  LoginEmailInp,
} from "../main";

export function switchForm(from: HTMLFormElement, to: HTMLFormElement) {
  from.classList.toggle("hide");
  to.classList.toggle("hide");
}
export function clearForm(type: "login" | "signup") {
  if (type === "signup") {
    signupEmailInp.value = "";
    siginupPasswordInp.value = "";
  } else {
    LoginPasswordInp.value = "";
    LoginEmailInp.value = "";
  }
}
