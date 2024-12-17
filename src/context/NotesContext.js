import React, { createContext, useState, useContext } from "react";

const NotesContext = createContext();

export const NotesProvider = ({ children }) => {
  const [notesId, setNotesId] = useState(null);

  return (
    <NotesContext.Provider value={{ notesId, setNotesId }}>
      {children}
    </NotesContext.Provider>
  );
};

export const useNotesContext = () => {
  return useContext(NotesContext);
};
