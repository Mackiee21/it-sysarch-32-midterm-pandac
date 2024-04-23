import { axiosPrivate } from "../axios/axiosPrivate";
import { useAppContext } from "../provider";
import logo from "../assets/logo.png";
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Mail, Lock, Eye } from "lucide-react";
import FieldInput from "../components/FieldInput";
import Button from "../components/Button";

const Login = () => {
  const { login, setTokenExpired } = useAppContext();

  const emailRef = useRef<HTMLInputElement>(null);
  const [errorMes, setErrorMes] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const [loggingIn, setLogginIn] = useState(false);

  useEffect(() => emailRef.current?.focus(), []);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setLogginIn(true);
      const response = await axiosPrivate.post("/api/auth/login", {
        email: emailRef.current?.value,
        password,
      });

      console.log("DATA DURING LOGIN", response.data);
      login({ ...response.data.user, token: response.data.token });
      setTokenExpired(false); //NEED THIS SO THAT IF USER RE-LOGS IN WE RESET TO TOKEN EXPIRED STATE
      console.log(response);
    } catch (error: any) {
      console.log(error);
      setErrorMes(error.response.data.message);
    } finally {
      setLogginIn(false);
    }
  };
  return (
    <form
      onSubmit={handleLogin}
      onChange={() => setErrorMes(null)}
      className="z-[1] w-full max-w-[330px] mx-auto flex flex-col gap-2"
    >
      <img className="w-40 mx-auto" src={logo} alt="logo" />
      <h1 className="text-center text-2xl font-medium mb-5">Login</h1>
      {errorMes && (
        <p className="error-message mb-3">Incorrect email or password</p>
      )}
      <FieldInput>
        <label htmlFor="email" className="p-2">
          <Mail color="#D24545" />
        </label>
        <input
          ref={emailRef}
          className="flex-1"
          type="text"
          id="email"
          placeholder="Email"
          required
        />
      </FieldInput>
      <FieldInput className="mt-5">
        <label className="p-2" htmlFor="password">
          <Lock color="#D24545" />
        </label>
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="relative"
          type={`${showPassword ? "text" : "password"}`}
          id="password"
          placeholder="Password"
          required
        />
        {!!password && (
          <Eye
            color="gray"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 cursor-pointer"
          />
        )}
      </FieldInput>
      <Button className="mt-5" disabled={loggingIn}>
        {loggingIn ? "Authenticating..." : "Log in"}
      </Button>
      <p className="font-normal text-sm">
        Don't have an account?{" "}
        <Link to="/signup" className="font-bold">
          Sign up
        </Link>
      </p>
    </form>
  );
};

export default Login;
