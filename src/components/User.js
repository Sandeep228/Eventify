import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

const User = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();

  return (
    <div className="profile-container">
      {isLoading && <div>Loading ...</div>}

      {isAuthenticated && (
        <div>
          <img src={user?.picture} alt={user?.name} />
          <h2 className="username">{user?.name}</h2>
          <p className="email">{user?.email}</p>
        </div>
      )}
    </div>
  );
};

export default User;
