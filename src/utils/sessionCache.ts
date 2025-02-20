import { ICache } from "@auth0/auth0-react";

class SessionCache implements ICache {
  get<T>(key: string): T | undefined {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : undefined;
    } catch (error) {
      console.error("Errore nel recupero da sessionStorage", error);
      return undefined;
    }
  }

  set<T>(key: string, entry: T): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(entry));
    } catch (error) {
      console.error("Errore nel salvataggio in sessionStorage", error);
    }
  }

  remove(key: string): void {
    try {
      sessionStorage.removeItem(key);
    } catch (error) {
      console.error("Errore nella rimozione da sessionStorage", error);
    }
  }
}

export default SessionCache;
