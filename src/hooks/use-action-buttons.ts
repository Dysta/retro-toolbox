import { ActionButtonsContext } from "@/context/action-buttons";
import React from "react";

function useActionButtonsFactory(
  factory: () => React.ReactNode,
  deps: React.DependencyList = [],
) {
  const { setActions } = React.useContext(ActionButtonsContext);

  React.useEffect(() => {
    setActions(factory());
    return () => setActions(null);
  }, [factory, ...deps]);
}

export function useActionButtons(
  factory: () => React.ReactNode,
  deps: React.DependencyList,
) {
  const actions = React.useMemo(factory, deps);
  useActionButtonsFactory(() => actions, deps);
}
