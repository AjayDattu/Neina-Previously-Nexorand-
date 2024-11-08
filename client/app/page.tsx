"use client"
import { Button } from "@/components/ui/button";
import Leaderboard from "@/components/ui/leaderboard";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailure } from "./store/authSlice";

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = storedUser;
      console.log(user)
      console.log("Retrieved user:", user);
      dispatch(loginSuccess(user));
    }
  }, [dispatch]);

  return (
    <div className="p-6">
      <Leaderboard/>
    </div>
  );
}
