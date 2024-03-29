//
// i user the command  npm i -D sass to add sass to vite


import "./scss/main.scss";
import { switchForm } from "./compontents/Form";
import toggleloader from "./compontents/Loader";
import {
  addData,
  deleteData,
  login,
  signout,
  signup,
  signupWithGoogle,
  updateData,
} from "./Database/firebase";

export {
  signupform,
  signupEmailInp,
  siginupPasswordInp,
  signupSumbit,
  LoginForm,
  LoginEmailInp,
  LoginPasswordInp,
  loginSumbit,
};
export type dataT = {
  day: string;
  date: string;
  content: string;
  id: string;
  index: number;
}[];

// manual data (hard coded for testing phase)
// let userData: dataT = [
//   {
//     day: "01",
//     date: "monday",
//     content:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim illo temporibus fuga in debitis officiis, modi commodi eos saepe numquam voluptates magni beatae adipisci iure atque vitae cum repellendus. Veritatis.",
//   },
//   {
//     day: "02",
//     date: "tuesday",
//     content:
//       "Lorem ipsum dolor sit amet consectetur adipisicing elit. Enim illo temporibus fuga in debitis officiis, modi commodi eos saepe numquam voluptates magni beatae adipisci iure atque vitae cum repellendus. Veritatis.",
//   },
// ];

/////////////////////////////////////////////////////
//Elements /////////////////////////////////
//--START
/////////////////////////////////////////////////////

const signupform = document.querySelector("form.signup") as HTMLFormElement;
const signupEmailInp: HTMLInputElement = signupform.querySelector(
  "#signup-email"
) as HTMLInputElement;
const siginupPasswordInp: HTMLInputElement = signupform.querySelector(
  "#signup-password"
) as HTMLInputElement;
const signupSumbit = signupform.signupSubmit;
const signupWithGoogleBtn = signupform["google-btn"];
const hasAccBtn = signupform.querySelector(
  "#has-account-btn"
) as HTMLAnchorElement;
const LoginForm = document.querySelector("form.login") as HTMLFormElement;
const LoginEmailInp: HTMLInputElement = LoginForm.querySelector(
  "#login-email"
) as HTMLInputElement;
const LoginPasswordInp: HTMLInputElement = LoginForm.querySelector(
  "#login-password"
) as HTMLInputElement;
const loginSumbit = LoginForm.SubmitButton;
const createAccBtn = LoginForm.querySelector(
  "#create-account-btn"
) as HTMLAnchorElement;

const menuBtn = document.querySelector(".menu-btn") as HTMLButtonElement;
const logoutBtn = document.querySelector("#logout-btn") as HTMLButtonElement;
const saveBtn = document.querySelector("#save-btn") as HTMLButtonElement;
const deleteBtn = document.querySelector("#delete-btn") as HTMLButtonElement;

///////////////////////////////////////////////////////
// Eventlisteners////////////////////////////////////
//--START
///////////////////////////////////////////////////////

// signup
signupSumbit.addEventListener("click", function (e: Event): void {
  e.preventDefault();
  if ((signupEmailInp.value, siginupPasswordInp.value)) {
    signup(signupEmailInp.value, siginupPasswordInp.value);
  } else {
    displayMessgae("Sign up to open idea notes", "normal");
  }
});

// Google auth
signupWithGoogleBtn.addEventListener("click", function (e: any) {
  e.preventDefault();
  e.stopImmediatePropagation();
  signupWithGoogle();
});

// login
loginSumbit.addEventListener("click", function (e: Event): void {
  e.preventDefault();
  if ((LoginEmailInp.value, LoginPasswordInp.value)) {
    login(LoginEmailInp.value, LoginPasswordInp.value);
  }
});

// logout
logoutBtn.addEventListener("click", function (e) {
  e.preventDefault();
  signout();
  resetApp();
});
// swtiching form form signup to login
hasAccBtn.addEventListener("click", function (e): void {
  e.preventDefault();
  e.stopImmediatePropagation();
  switchForm(signupform, LoginForm);
});

// swtiching form form  login to signup
createAccBtn.addEventListener("click", function (e): void {
  e.preventDefault();
  e.stopImmediatePropagation();

  switchForm(LoginForm, signupform);
});
menuBtn.addEventListener("click", function (e): void {
  e.preventDefault();
  e.stopImmediatePropagation();
  toggleMenu("open");
});
// handle save button
saveBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const activeBtn = document.querySelector(".active") as HTMLButtonElement;
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  // const modifiedDate = document.querySelector("#modified-date") as HTMLElement;

  if (activeBtn) {
    updateData(activeBtn, textarea);
    activeBtn.click();
  }
});
deleteBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const activeBtn = document.querySelector(".active") as HTMLButtonElement;
  if (activeBtn) {
    const ID: string = activeBtn.getAttribute("data-id") + "";
    deleteData(ID);
    resetMain();
  }
});

/////////////////////////////////////////////////////
//resuable funcitons/////////////////////////////////
//--START
/////////////////////////////////////////////////////

// open dashboard  func
export function toggleDashboard(command: "open" | "close"): void {
  const formSection = document.querySelector(".section-forms") as HTMLElement;

  if (command === "open") {
    toggleloader("open");
    resetMain();

    setTimeout(() => {
      formSection.classList.add("page-slider");
      toggleloader("close");
      formSection.classList.add("displayNone");
    }, 5000);
  } else {
    toggleloader("open");

    setTimeout(() => {
      formSection.classList.remove("page-slider");
      toggleloader("close");
      formSection.classList.remove("displayNone");
    }, 5000);
  }
}

// open menu bar func
function toggleMenu(command: "open" | "close"): void {
  const aside = document.querySelector("#dashboard-menu") as HTMLElement;
  command;

  aside.classList.toggle("open-menu");
  menuBtn.classList.toggle("open");

  // if (command === "close") {
  //   aside.classList.remove("open-menu");
  //   menuBtn.classList.remove("open");
  // }
}

// activate days buttons
export function ActiveDaysBtn(data: dataT): void {
  resetMain();
  let currentData;
  let html: string = "";
  const daysBtnCont = document.querySelector(".days-cont") as HTMLDivElement;

  // setting the days button
  data.forEach(function ({ id, index }: any) {
    html += `<button type="button" id="day-btn" data-index="${index}" data-id="${id}">idea0${index}</button>`;
  });
  html += `<button type="button" id="add">&plus;</button>`;
  daysBtnCont.innerHTML = html;

  const daysButtons = document.querySelectorAll("#day-btn");
  const main = document.querySelector(".dash-main");

  daysButtons.forEach(function (btn: Element): void {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      // reset active btn
      daysButtons.forEach(function (btn2) {
        if (btn2.classList.contains("active")) btn2.classList.remove("active");
      });
      btn.classList.add("active");

      currentData = data.filter(
        (da) => da.index === Number(btn.getAttribute("data-index"))
      );
      displayData(currentData[0]);
      main?.classList.remove("hide-in-main");
    });
  });
  const addBtn = document.querySelector("#add") as HTMLButtonElement;
  addBtn.addEventListener("click", function (e) {
    e.preventDefault();
    e.stopImmediatePropagation();
    toggleMenu("open");
    addData(daysButtons.length + 1);
  });
}

function displayData(data: any) {
  const modifiedDate = document.querySelector("#modified-date") as HTMLElement;
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  const pageNumber = document.querySelector(".page-number") as HTMLElement;

  modifiedDate.textContent = `${new Date(data.date).toDateString()}  ${new Date(
    data.date
  ).toLocaleTimeString()}`
    .replace("Mon", "Monday")
    .replace("Tue", "Tuesday")
    .replace("Wed", "Wednesday")
    .replace("Thur", "Thursday")
    .replace("Fri", "Friday")
    .replace("Sat", "Saturday")
    .replace("Sun", "Sunday");
  textarea.value = data.content;
  pageNumber.textContent = "0" + data.index;

  displayMessgae("Opened idea " + `0${data.index}`, "normal");
}

///  for displaying any type  of message on the ui (func)
// custom alert window

export function displayMessgae(
  message: string,
  type: "success" | "error" | "normal"
): void {
  const messageCont = document.querySelector(".display-message") as HTMLElement;
  const messageEl = messageCont.querySelector(".message") as HTMLElement;

  messageCont.classList.toggle("close");
  messageEl.textContent = message;

  messageEl.setAttribute("data-type", type);

  setTimeout(() => {
    messageCont.classList.add("close");
    messageEl.textContent = "";
  }, 5000);
}

export function resetApp() {
  toggleMenu("close");
  setupAccount({ email: "" });
  toggleDashboard("close");
  resetMain();
}

export function setupAccount(user: any): void {
  const displayEmail = document.querySelector(
    "#display-email"
  ) as HTMLParagraphElement;

  displayEmail.textContent = user.email;
}
function resetMain() {
  const modifiedDate = document.querySelector("#modified-date") as HTMLElement;
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  const pageNumber = document.querySelector(".page-number") as HTMLElement;
  const main = document.querySelector(".dash-main");

  modifiedDate.innerHTML = textarea.value = pageNumber.innerHTML = "";
  toggleMenu("close");
  main?.classList.add("hide-in-main");
}
