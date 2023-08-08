import { createContext, useContext, useState } from 'react';

// Create a context for managing the user session
const SessionContext = createContext();

// Provider component to wrap your app and provide the session context
export function SessionProvider({ children, initialSession }) {
  const [session, setSession] = useState(initialSession);

  return (
    <SessionContext.Provider value={{ session, setSession }}>
      {children}
    </SessionContext.Provider>
  );
}

// Custom hook to access the session data and update the session
export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}
