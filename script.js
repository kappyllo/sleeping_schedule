const confirmButton = document.querySelector(".button-confirm");
const timeBeforeExitForm = document.querySelector(".time-before-exit");
const inputSleeping = document.querySelector("#input-sleep-time");
const leavingTimeForm = document.querySelector(".leaving-time");
const getResultButton = document.querySelector("#confirm-btn");
const notFilledTimeBeExit = document.querySelector("#not-filled-sleep-time");
const notCheckedGettingTime = document.querySelector(
  "#not-filled-getting-time"
);
const inputLeavingTime = document.querySelector("#input-leaving-time");
const notFilledLeavingTime = document.querySelector("#not-filled-leaving-time");
let results = undefined;
let buttonClicked = false;

const createHtml = (
  bedTime,
  alarmTime,
  bedPercent,
  alarmPercent
) => `<div class="results hidden">
  <h4 class="heading bed-div">
    <div class="upper"> You have to go to <span class="italy">bed</span> at: </div> <br id />
    <div class="bottom"><span id="bed-time" class="italy">${bedTime}</span></div>
  </h4>
  <h5 class="heading" id="reseting-margin">
    <div class="upper"> And set the <span class="italy">alarm</span> to: </div> <br id="upper-br" />
    <div class="bottom"><span id="alarm-time" class="italy">${alarmTime}</span></div>
  </h5>
  </div>
  <div class="stats">
  <h6 class="heading" id="reseting-margin">
  <div class="center-align">You are <b>sleeping</b> <span class="green-underline">${bedPercent}</span> than average.</div>
  <div id="bottom-stat" class="center-align">And <b>waking up</b> <span class="green-underline">${alarmPercent}</span> than average.</div>
  </h6>
  </div>
  `;

function getStats(sleepingHours, alarmTime) {
  const avgBedTime = "7:00"; //(28/10/2023)
  const avgBedHours = getHoursFromTime(avgBedTime);

  let hoursDifferanceSleeping = hoursDifferance(
    Number(sleepingHours),
    Number(avgBedHours)
  );

  const avgAlarmTime = "7:09"; //(28/10/2023)
  const avgAlarmHours = getHoursFromTime(avgAlarmTime);

  const alarmHours = getHoursFromTime(alarmTime);

  let hoursDifferanceWakingUp = hoursDifferance(
    Number(alarmHours),
    Number(avgAlarmHours)
  );

  if (hoursDifferanceSleeping < 0) {
    if (Math.abs(hoursDifferanceSleeping) == 1) {
      hoursDifferanceSleeping =
        Math.abs(hoursDifferanceSleeping) + " " + "hour shorter";
    } else {
      hoursDifferanceSleeping =
        Math.abs(hoursDifferanceSleeping) + " " + "hours shorter";
    }
  } else {
    if (hoursDifferanceSleeping == 1) {
      hoursDifferanceSleeping += " hour longer";
    } else {
      hoursDifferanceSleeping += " hours longer";
    }
  }

  if (hoursDifferanceWakingUp < 0) {
    if (Math.abs(hoursDifferanceWakingUp) == 1) {
      hoursDifferanceWakingUp =
        Math.abs(hoursDifferanceWakingUp) + " " + "hour earlier";
    } else {
      hoursDifferanceWakingUp =
        Math.abs(hoursDifferanceWakingUp) + " " + "hours earlier";
    }
  } else {
    if (hoursDifferanceWakingUp == 1) {
      hoursDifferanceWakingUp += " hour sooner";
    } else {
      hoursDifferanceWakingUp += " hours sooner";
    }
  }

  return [hoursDifferanceSleeping, hoursDifferanceWakingUp];
}

const getHoursFromTime = (time) => {
  return time.split(":")[0];
};

const hoursDifferance = (x, y) => {
  return x - y;
};

function sleep(time) {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function confirmButtonClicked() {
  timeBeforeExitForm.style = "margin-left: 0";
  sleep(500).then(() => {
    leavingTimeForm.style = "margin-left: 0";
  });
}

function slideNewHtml() {
  sleep(0.1).then(() => {
    document.querySelector(".slide-from-right-results").style =
      "margin-left: 0; transition: 0.6s";
  });
}

function getResultButtonClicked() {
  let filledWindowsCount = 0;
  let choosenSleepTime, timeBeforeExit, leavingTime;
  if (inputSleeping.value.length === 0) {
    notFilledTimeBeExit.classList.remove("hidden");
  } else {
    if (Number(document.querySelector("#input-sleep-time").value) > 24) {
      choosenSleepTime = "24";
      filledWindowsCount += 1;
      notFilledTimeBeExit.classList.add("hidden");
    } else {
      choosenSleepTime = document.querySelector("#input-sleep-time").value;
      filledWindowsCount += 1;
      notFilledTimeBeExit.classList.add("hidden");
    }
  }
  if (document.querySelector('input[name = "time-before"]:checked') != null) {
    timeBeforeExit = document.querySelector(
      'input[name = "time-before"]:checked'
    ).value;
    filledWindowsCount += 1;
    notCheckedGettingTime.classList.add("hidden");
  } else {
    notCheckedGettingTime.classList.remove("hidden");
  }
  if (inputLeavingTime.value === "") {
    notFilledLeavingTime.classList.remove("hidden");
  } else {
    leavingTime = inputLeavingTime.value;
    filledWindowsCount += 1;
    notFilledLeavingTime.classList.add("hidden");
  }
  if (filledWindowsCount === 3) {
    results = calculateBedHour(choosenSleepTime, timeBeforeExit, leavingTime);
    confirmButton.removeEventListener("click", confirmButtonClicked);
    getResultButton.removeEventListener("click", getResultButtonClicked);
    buttonClicked = true;
    const percents = getStats(choosenSleepTime, results[0]);
    document.querySelector(".middle-section").innerHTML = createHtml(
      results[1],
      results[0],
      percents[0],
      percents[1]
    );
    document.querySelector(".results").classList.remove("hidden");

    document
      .querySelector(".middle-section")
      .classList.add("slide-from-right-results");
    slideNewHtml();
  }
}

function getWakeUpTime(leaveHour, leaveMinutes, gettingReadyminutes) {
  const minutesSum = leaveHour * 60 + leaveMinutes;
  const wakeUpMinutes = minutesSum - gettingReadyminutes;
  return wakeUpMinutes;
}

function getBedHour(wakeUpMinutes, sleepHours) {
  const sleepingMinutes = sleepHours * 60;
  let bedHour = wakeUpMinutes - sleepingMinutes;
  if (bedHour < 0) {
    bedHour = 12 * 60 - Math.abs(bedHour);
    bedHour += 12 * 60;
  }
  return bedHour;
}

function NumToTime(num) {
  let hours = Math.floor(num / 60);
  let minutes = num % 60;
  if (minutes + "".length < 10) {
    minutes = "0" + minutes;
  }
  return hours + ":" + minutes;
}

function calculateBedHour(sleepHours, gettingTime, leavingT) {
  const sleepingHours = Number(sleepHours);
  const gettingMinutes = Number(gettingTime);
  const leaveTimeArray = leavingT.split(":");
  const leaveTimeHours = Number(leaveTimeArray[0]);
  const leaveTimeMinutes = Number(leaveTimeArray[1]);
  const getUpMinutes = getWakeUpTime(
    leaveTimeHours,
    leaveTimeMinutes,
    gettingMinutes
  );
  const bedHour = getBedHour(getUpMinutes, sleepingHours);
  const wakeUpTime = NumToTime(getUpMinutes);
  const bedDown = NumToTime(bedHour);
  const hoursArray = [wakeUpTime, bedDown];
  return hoursArray;
}

confirmButton.addEventListener("click", confirmButtonClicked);
getResultButton.addEventListener("click", getResultButtonClicked);
