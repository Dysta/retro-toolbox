"use client";

import React from "react";

type ActionButtonsContextType = {
  setActions: (actions: React.ReactNode) => void;
};

export const ActionButtonsContext =
  React.createContext<ActionButtonsContextType>({
    setActions: () => {},
  });

export function useActionButtons(
  factory: () => React.ReactNode,
  deps: React.DependencyList,
) {
  const { setActions } = React.useContext(ActionButtonsContext);

  const actions = React.useMemo(factory, deps);

  React.useEffect(() => {
    setActions(actions);
    return () => setActions(null);
  }, [actions, setActions]);
}
