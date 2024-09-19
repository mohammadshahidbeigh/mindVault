import React, {useState} from "react";
import {useSelector, useDispatch} from "react-redux";
import {RootState} from "../store"; // Changed import path
import {login} from "../store/userSlice";

const Profile: React.FC = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state: RootState) => state.user);

  const [name, setName] = useState(userInfo?.userInfo?.name || "");
  const [email, setEmail] = useState(userInfo?.userInfo?.email || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(login({name, email}));
  };

  if (!userInfo) {
    return <div>Please log in to view your profile.</div>;
  }

  return (
    <div>
      <h2>User Profile</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default Profile;
