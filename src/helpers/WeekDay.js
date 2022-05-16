/**
  * Utilidades para manejar los días de la semana.
  * */
class WeekDay {
  /**
    * Devuelve el día de la semana actual.
    * @returns {string} - Día de la semana.
    * */
  // By Gabriel Kohen
  // https://stackoverflow.com/questions/9677757/how-to-get-the-day-of-the-week-from-the-day-number-in-javascript
  static getCurrentWeekDay() {
    return new Date().toLocaleString("en-us", { weekday: "long" });
  }

  /**
   * Devuelve el día de la semana siguiente al día dado.
   * @param {string} weekDay - Día de la semana (ej. "Monday")
   * @returns {string} - Día siguiente de la semana.
   */
  static nextWeekDay(weekDay) {
    switch (weekDay) {
      case "Sunday":
        return "Monday";
      case "Monday":
        return "Tuesday";
      case "Tuesday":
        return "Wednesday";
      case "Wednesday":
        return "Thursday";
      case "Thursday":
        return "Friday";
      case "Friday":
        return "Saturday";
      case "Saturday":
        return "Sunday";
      default:
        break;
    }
  }

  /**
   * Devuelve el día anterior de la semana.
   * @param {string} weekDay - Día de la semana.
   * @returns {string} - Día anterior de la semana.
   */
  static previousWeekDay(weekDay) {
    switch (weekDay) {
      case "Sunday":
        return "Saturday";
      case "Monday":
        return "Sunday";
      case "Tuesday":
        return "Monday";
      case "Wednesday":
        return "Tuesday";
      case "Thursday":
        return "Wednesday";
      case "Friday":
        return "Thursday";
      case "Saturday":
        return "Friday";
      default:
        break;
    }
  }

  /**
   * Convierte el día de la semana en un índice 0 basado empezando por domingo (ej. 0 - domingo, 1 - lunes...)
   * @param {string} weekDay - Día de la semana. (ej. "Monday")
   * @returns {Number} - Índice del día de la semana.
   */
  static weekDayToNumber(weekDay) {
    switch (weekDay) {
      case "Sunday":
        return 0;
      case "Monday":
        return 1;
      case "Tuesday":
        return 2;
      case "Wednesday":
        return 3;
      case "Thursday":
        return 4;
      case "Friday":
        return 5;
      case "Saturday":
        return 6;
      default:
        break;
    }
  }
}

export default WeekDay;
