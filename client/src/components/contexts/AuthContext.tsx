import * as React from "react";

interface AuthContextData {
  user?: any;
  setting: any;
  chatBot: any;
  onShowResChatbot: (value: any) => void;
}

export const AuthContext = React.createContext<AuthContextData>({
  user: null,
  setting: null,
  chatBot: null,
  onShowResChatbot: () => {},
});
