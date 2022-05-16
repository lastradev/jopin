import Schedule from "../models/Schedule";
import WeekDay from "../helpers/WeekDay";

/**
  * Envuelve localStorage para hacer operaciones CRUD validadas con objetos Schedule.
  */
class ScheduleStorage {
  /**
    * Agrega un objeto Schedule a localStorage.
    * @param {Schedule} schedule - Objeto Schedule.
    * @throws {Error} - Tira un error si el objeto no es de tipo Schedule.
    * @returns {string} - ID del objeto Schedule, utilizado en la base de datos.
    */
  static add(schedule) {
    if (!(schedule instanceof Schedule)) {
      throw Error("Error: Expected an object instanceof Entry.");
    }

    const jsonEntry = JSON.stringify(schedule);
    localStorage.setItem(schedule.id, jsonEntry);

    return schedule.id;
  }

  /**
     * Agrega todos los objetos de tipo Schedule que se le pasen como array a localStorage.
     * @param {Schedule[]} schedules - Objetos Schedule.
     */
  static addAll(schedules) {
    schedules.forEach(schedule => {
      this.add(schedule);
    });
  }

  /**
     * Devuelve un objeto Schedule de localStorage.
     * @param {string} id - ID del objeto a obtener.
     * @throws {Error} - Tira un error si el ID no existe o no le pertenece a un Schedule.
     * @returns {Schedule} - Objeto Schedule.
     */
  static get(id) {
    const jsonEntry = localStorage.getItem(id);
    if (!jsonEntry) {
      throw Error("Error: Fetched object with this ID does not exists.");
    }
    try {
      const schedule = Schedule.fromJson(jsonEntry);
      return schedule;
    } catch {
      throw Error("Error: Fetched object is not instanceof Entry.");
    }
  }

  /**
    * Devuelve todos los Schedules de localStorage.
    * @returns {Schedule[]} - Array de Schedules.
    * */
  static getAll() {
    let entries = [];
    const keys = Object.keys(localStorage);

    for (let i = 0; i < keys.length; i++) {
      try {
        const schedule = this.get(keys[i]);
        entries.push(schedule);
      } catch { }
    }

    const result = this.sortByTime(entries);
    return result;
  }

  /**
    * Devuelve todos los Schedule del día de la semana indicado de localStorage.
    * @param {string} weekDay - Día de la semana ("Monday", "Tuesday", ...)
    * @returns {Schedule[]} - Array de Schedules.
    */
  static getAllFromWeekDay(weekDay) {
    let result = [];
    const weekDayNumber = WeekDay.weekDayToNumber(weekDay);
    const entries = this.getAll();
    entries.forEach((schedule) => {
      if (schedule.days[weekDayNumber] === 1) {
        result.push(schedule);
      }
    });
    return result;
  }

  /**
    * Ordena y devuelve Schedules por horario.
    * @param {Schedule[]} schedules - Array de Schedules.
    * @returns {Schedule[]} - Array de Schedules.
    */
  static sortByTime(schedules) {
    schedules.sort((a, b) => {
      if (a.time > b.time) {
        return 1;
      }
      if (a.time < b.time) {
        return -1;
      }
      return 0;
    });
    return schedules;
  }

  /**
    * Elimina un Schedule del localStorage.
    * @throws {Error} - Tira un error cuando el objeto a eliminar no existe o no es un Schedule.
    * @param {string} id - Id del objeto a eliminar.
    */
  static delete(id) {
    try {
      this.get(id);
    } catch (notAScheduleError) {
      throw notAScheduleError;
    }
    localStorage.removeItem(id);
  }

  /**
     * Edita un objeto Schedule en localStorage.
     * @throws {Error} - Tira error si el objeto editado no es de tipo Schedule.
     * @param {Schedule} schedule - Objeto Schedule editado.
     */
  static edit(schedule) {
    this.get(schedule.id);
    if (!(schedule instanceof Schedule)) {
      throw Error("Error: Object given is not Schedule");
    }

    const jsonEntry = JSON.stringify(schedule);
    localStorage.setItem(schedule.id, jsonEntry);
  }

  /**
    * Elimina todos los objetos Schedule de localStorage.
    * */
  static clear() {
    const keys = Object.keys(localStorage);

    for (let i = 0; i < keys.length; i++) {
      try {
        this.delete(keys[i]);
      } catch { }
    }
  }

  /**
    * Habilita o deshabilita el objeto Schedule en localStorage.
    * @param {string} id - Id del Schedule a habilitar o deshabilitar
    */
  static toggle(id) {
    const schedule = this.get(id);
    schedule.enabled = !schedule.enabled;
    this.edit(schedule);
  }
}

export default ScheduleStorage;
