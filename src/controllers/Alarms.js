/*global chrome*/

import Formatters from "../helpers/Formatters";
import ScheduleStorage from "../controllers/ScheduleStorage";

class Alarms {
  static create(schedule) {
    for (let i = 0; i < schedule.days.length; i++) {
      if (schedule.days[i] === 0) {
        continue;
      }
      let nearestWeekDayDate = this.getDateOfNearestWeekDay(i);
      nearestWeekDayDate.setHours(
        Formatters.timeToHour(schedule.time),
        Formatters.timeToMinutes(schedule.time),
        0 // seconds
      );

      // Alarms need different names
      // so we differentiate them with the week day number
      this.createAlarm(
        `${schedule.url} weekDay:${i}`,
        nearestWeekDayDate.getTime()
      );
    }
  }

  static createAll(schedules) {
    schedules.forEach((schedule) => {
      this.create(schedule);
    });
  }

  static edit(id, schedule) {
    const oldSchedule = ScheduleStorage.get(id);
    this.delete(oldSchedule);
    this.create(schedule);
  }

  static delete(schedule) {
    for (let i = 0; i < schedule.days.length; i++) {
      if (schedule.days[i] === 0) {
        continue;
      }
      chrome.alarms.clear(`${schedule.url} weekDay:${i}`);
    }
  }

  static deleteAll() {
    chrome.alarms.clearAll();
  }

  // Solution by Tim
  // https://stackoverflow.com/questions/1579010/get-next-date-from-weekday-in-javascript
  static getDateOfNearestWeekDay(weekDayNumber) {
    let result = new Date();
    result.setDate(
      result.getDate() + ((weekDayNumber + (7 - result.getDay())) % 7)
    );
    return result;
  }

  static createAlarm(url, date) {
    let alarmInfo = {};
    alarmInfo.when = date;
    alarmInfo.periodInMinutes = 10080; // every week
    chrome.alarms.create(url, alarmInfo);
  }
}

export default Alarms;