// src/context/EternalpEASEAiContext.tsx
import React, { createContext, useContext } from "react";
export const ETERNALPEASE_AI_NAME = "Peacey"; // Cute, unique AI name!

type EternalpEASEAiContextType = {
  aiName: string;
  greeting: string;
};

const EternalpEASEAiContext = createContext<EternalpEASEAiContextType>({
  aiName: ETERNALPEASE_AI_NAME,
  greeting: "Hi, I'm Peacey – your EternalpEASE assistant! How can I help you today?",
});

export const EternalpEASEAiProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const aiName = ETERNALPEASE_AI_NAME;
  const greeting = `Hi, I'm ${aiName} – your EternalpEASE assistant! How can I help you today?`;

  return (
    <EternalpEASEAiContext.Provider value={{ aiName, greeting }}>
      {children}
    </EternalpEASEAiContext.Provider>
  );
};

export const useEternalpEASEAi = () => useContext(EternalpEASEAiContext);