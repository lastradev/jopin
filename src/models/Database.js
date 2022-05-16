import Auth from "../services/Auth";
import Schedule from "../models/Schedule";
import { db } from "../services/firebase-config";
import {
  doc,
  where,
  query,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
} from "firebase/firestore";

const schedulesCollection = collection(db, "schedules");

/**
  * Controla la base de datos de Firebase.
  */
class Database {
  /**
    * Devuelve objetos Schedule pertenecientes al usuario de la colección de Firebase.
    * @returns {Schedule[]} - Objetos Schedule.
    */
  static getSchedules = async () => {
    const q = query(
      schedulesCollection,
      where("ownerId", "==", Auth.getUserId())
    );
    const data = await getDocs(q);
    return data.docs.map((doc) => {
      const data = doc.data()
      return new Schedule(
        data.name,
        data.url,
        data.time,
        data.days,
        data.ownerId,
        data.enabled,
        doc.id);
    });
  };

  /**
    * Crea un documento de tipo Schedule en la colección Schedules en Firebase.
    * @param {Schedule} schedule - Objeto Schedule.
    * @returns {Promise<string>} - ID del documento de Firebase.
    */
  static createSchedule = async (schedule) => {
    delete schedule.id;
    const doc = await addDoc(schedulesCollection, { ...schedule });
    return doc.id;
  };

  /**
    * Edita un documento de tipo Schedule en la colección Schedules en Firebase.
    * @param {Schedule} schedule - Objeto Schedule editado.
    */
  static updateSchedule = async (schedule) => {
    const scheduleDoc = doc(db, "schedules", schedule.id);
    const editedSchedule = { ...schedule };
    delete editedSchedule.id;
    await updateDoc(scheduleDoc, editedSchedule);
  };

  /**
    * Elimina un documento de tipo Schedule en la colección Schedules en Firebase.
    * @param {string} id - ID del documento a eliminar.
    */
  static deleteSchedule = async (id) => {
    const scheduleDoc = doc(db, "schedules", id);
    await deleteDoc(scheduleDoc);
  };

  /**
    * Elimina todos los documentos Schedule que le pertenecen al usuario en Firebase.
    */
  static deleteAllSchedules = async () => {
    const q = query(
      schedulesCollection,
      where("ownerId", "==", Auth.getUserId())
    );

    const data = await getDocs(q);
    data.forEach(async doc => {
      await deleteDoc(doc.ref);
    });
  }
}

export default Database;
