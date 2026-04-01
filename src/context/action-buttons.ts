import React from "react";

export const ActionButtonsContext = React.createContext<{
  setActions: (actions: React.ReactNode) => void;
}>({
  setActions: () => {},
});
