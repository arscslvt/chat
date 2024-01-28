import React, { useCallback } from "react";

interface Props {
  references: {
    [key: string]: React.RefObject<any>;
  };
  addReference: (key: string, ref: React.RefObject<any>) => void;
}

const ReferencesContext = React.createContext<Props>({} as Props);

export default function ReferencesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [references, setReferences] = React.useState<Props["references"]>(
    {} as Props["references"]
  );

  const addReference = useCallback((key: string, ref: React.RefObject<any>) => {
    setReferences((references) => ({ ...references, [key]: ref }));
  }, []);

  return (
    <ReferencesContext.Provider value={{ references, addReference }}>
      {children}
    </ReferencesContext.Provider>
  );
}

export const useReferences = () => React.useContext(ReferencesContext);
