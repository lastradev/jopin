import {
  signOut,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "./firebase-config";
import Database from "../models/Database";
import Alarms from "../controllers/Alarms";
import ScheduleStorage from "../controllers/ScheduleStorage";

/**
  * Administrador de autenticación con Firebase.
  */
class Auth {
  /**
    * Inicia Sesión y realiza una petición para sincronizar los horarios.
    * @param {string} email - Email del usuario.
    * @param {string} password - Password del usuario.
    * @returns {string | None} - Retorna un mensaje en caso de error.
    */
  static async signIn(email, password) {
    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const entries = await Database.getSchedules();
      ScheduleStorage.addAll(entries);
      Alarms.createAll(entries);
    } catch (e) {
      return this.handleError(e.code);
    }
  }

  /**
    * Devuelve un mensaje significativo para el error.
    * @param {string} errorCode - Codigo del error.
    * @returns {string} - Mensaje de error.
    */
  static handleError(errorCode) {
    switch (errorCode) {
      case "auth/invalid-email":
        return "Invalid Email / Password."
      case "auth/wrong-password":
        return "Invalid Email / Password."
      case "auth/user-not-found":
        return "No user found with this email."
      case "auth/operation-not-allowed":
        return "Server error, please try again.";
      case "auth/email-already-in-use":
        return "Email already used.";
      case "auth/weak-password":
        return "Weak password.";
      case "auth/user-disabled":
        return "User disabled.";
      case "auth/missing-email":
        return "Please enter an email."
      default:
        console.log(errorCode);
        return "Unkown error, please try again."
    }
  }

  /**
    * Crea una cuenta.
    * @param {string} email - Email de la cuenta.
    * @param {string} password - Contraseña de la cuenta.
    * @param {string} passwordConfirm - Confirmación de la contraseña de la cuenta.
    * @returns {string|None} - Devuelve un mensaje en caso de error.
    */
  static async createAccount(email, password, passwordConfirm) {
    if (password === passwordConfirm) {
      try {
        await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
      } catch (e) {
        return this.handleError(e.code);
      }
    } else {
      return "Passwords do not match.";
    }
  }

  /**
    * Monitorea el estado de la sesión.
    * @param {Function} onSignIn - Es llamado en caso de inicio de sesión.
    * @param {Function} onSignOut - Es llamado en caso de cierre de sesión.
    */
  static async monitorAuthState(onSignIn, onSignOut) {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        onSignIn();
      } else {
        onSignOut();
      }
    });
  }

  /**
    * Cierra sesión, elimina alarmas y Schedules del localStorage.
    */
  static async logout() {
    await signOut(auth);
    Alarms.deleteAll();
    ScheduleStorage.clear();
  }

  /**
    * Obtiene el ID del usuario
    * @returns {string} - ID del usuario.
    */
  static getUserId() {
    return auth.currentUser.uid;
  }
}

export default Auth;
