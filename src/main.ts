//
import "./styles/main.css";
import { switchForm } from "./compontents/Form";
import toggleloader from "./compontents/Loader";
import { db, login, signout, signup } from "./Database/firebase";
import { doc, updateDoc } from "firebase/firestore";

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
console.log("hey");
//

// signup
signupSumbit.addEventListener("click", function (e: Event): void {
  e.preventDefault();
  if ((signupEmailInp.value, siginupPasswordInp.value)) {
    signup(signupEmailInp.value, siginupPasswordInp.value);
  }
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
  switchForm(signupform, LoginForm);
});

// swtiching form form  login to signup
createAccBtn.addEventListener("click", function (e): void {
  e.preventDefault();
  switchForm(LoginForm, signupform);
});
menuBtn.addEventListener("click", function (e): void {
  e.preventDefault();
  toggleMenu("open");
});
// handle save button
saveBtn.addEventListener("click", function (e) {
  e.preventDefault();
  const activeBtn = document.querySelector(".active");
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  const displayEmail = document.querySelector(
    "#disaply-email"
  ) as HTMLParagraphElement;

  if (activeBtn) {
    updateDoc(
      doc(
        db,
        `${displayEmail.textContent}`,
        `${activeBtn.getAttribute("data-id")}`.trim()
      ),
      { content: textarea.value }
    )
      .then(function () {
        displayMessgae("SAVED", "success");
      })
      .catch(function (err) {
        displayMessgae(err.message, "error");
      });
  }
});
deleteBtn.addEventListener("click", function (e) {
  e.preventDefault();
  // const activeBtn = document.querySelector(".active");
  // if (activeBtn) {
  //   const index = userData.findIndex(function (data) {
  //     return data.day === activeBtn.getAttribute("data-day");
  //   });
  //   userData.splice(index, index + 1);
  //   ActiveDaysBtn(userData);
  // }
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
  if (!aside.classList.contains("open-menu")) {
    aside.classList.add("open-menu");
    menuBtn.classList.add("open");
  } else {
    aside.classList.remove("open-menu");
    menuBtn.classList.remove("open");
  }
}

// activate days buttons
export function ActiveDaysBtn(data: dataT): void {
  resetMain();
  const daysBtnCont = document.querySelector(".days-cont") as HTMLDivElement;
  let html: string = "";
  data.forEach(function (dayObj: any) {
    html += `<button type="button" id="day-btn" data-day="${dayObj.day}" data-id="${dayObj.id}">day${dayObj.day}</button>`;
  });
  html += `<button type="button" id="add">&plus;</button>`;
  daysBtnCont.innerHTML = html;

  const daysButtons = document.querySelectorAll("#day-btn");
  let currentData;
  daysButtons.forEach(function (btn: Element): void {
    btn.addEventListener("click", function (e) {
      e.preventDefault();
      //reset active btn
      daysButtons.forEach(function (btn2) {
        if (btn2.classList.contains("active")) btn2.classList.remove("active");
      });
      btn.classList.add("active");

      currentData = data.filter(
        (data) => data.day === btn.getAttribute("data-day")
      );
      displayData(currentData[0]);
    });
  });
}

function displayData(data: any) {
  const modifiedDate = document.querySelector("#modified-date") as HTMLElement;
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  const pageNumber = document.querySelector(".page-number") as HTMLElement;

  modifiedDate.textContent = new Date(data.date).toDateString();
  textarea.value = data.content;
  pageNumber.textContent = data.day;

  displayMessgae("Opened day " + data.day, "normal");
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
}

export function setupAccount(user: any): void {
  const displayEmail = document.querySelector(
    "#disaply-email"
  ) as HTMLParagraphElement;

  displayEmail.textContent = user.email;
}
function resetMain() {
  const modifiedDate = document.querySelector("#modified-date") as HTMLElement;
  const textarea = document.querySelector("textarea") as HTMLTextAreaElement;
  const pageNumber = document.querySelector(".page-number") as HTMLElement;

  modifiedDate.innerHTML = textarea.value = pageNumber.innerHTML = "";
}
