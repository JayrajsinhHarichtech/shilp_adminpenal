import React, { createContext, useState } from "react";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState({
    firstName: "Jayrajsinh",
    lastName: "Jadav",
    email: "jayrajsinhjadav261.com",
    mobile: "9157783727",
    state: "Gujarat",
    city: "Ahmedabad",
    pincode: "380034",
    address: "Yorem ipsum dolor sit amet, consectetur adipiscing elit.",
    avatar: "/Logo/shilp-logo.svg",
  });

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
