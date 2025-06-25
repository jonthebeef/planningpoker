// Simple offline mode storage for development
class OfflineStorage {
  constructor() {
    this.data = {
      participants: {},
      currentTicket: null,
      tickets: {},
      votes: {},
      revealed: {}
    };
    this.listeners = new Set();
  }

  // Simulate Firebase ref
  ref(path) {
    return {
      path,
      set: (value) => {
        this.setData(path, value);
        this.notifyListeners();
        return Promise.resolve();
      },
      remove: () => {
        this.removeData(path);
        this.notifyListeners();
        return Promise.resolve();
      }
    };
  }

  // Simulate Firebase onValue
  onValue(ref, callback, errorCallback) {
    // Add listener
    const listener = { ref, callback, errorCallback };
    this.listeners.add(listener);

    // Call immediately with current data
    setTimeout(() => {
      try {
        const data = this.getData(ref.path);
        callback({ val: () => data });
      } catch (error) {
        if (errorCallback) errorCallback(error);
      }
    }, 100);

    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  setData(path, value) {
    const keys = path.split('/').filter(k => k);
    let current = this.data;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {};
      current = current[keys[i]];
    }
    
    if (keys.length > 0) {
      current[keys[keys.length - 1]] = value;
    }
  }

  removeData(path) {
    const keys = path.split('/').filter(k => k);
    let current = this.data;
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) return;
      current = current[keys[i]];
    }
    
    if (keys.length > 0) {
      delete current[keys[keys.length - 1]];
    }
  }

  getData(path) {
    const keys = path.split('/').filter(k => k);
    let current = this.data;
    
    for (const key of keys) {
      if (!current || !current[key]) return null;
      current = current[key];
    }
    
    return current;
  }

  notifyListeners() {
    this.listeners.forEach(listener => {
      try {
        const data = this.getData(listener.ref.path);
        listener.callback({ val: () => data });
      } catch (error) {
        if (listener.errorCallback) listener.errorCallback(error);
      }
    });
  }
}

export const offlineStorage = new OfflineStorage();
export const serverTimestamp = () => Date.now(); 