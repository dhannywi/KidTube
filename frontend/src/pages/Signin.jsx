import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { loginError, loginStart, loginSuccess } from "../redux/userSlice";
import { auth, googleAuthProvider } from "../firebase";
import { signInWithPopup } from "firebase/auth";
import { Link } from "react-router-dom";
import { axiosInstance } from "../utils/axiosConfig";
import Swal from "sweetalert2";
import Loader from "../components/Loader";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 83vh;
  color: ${({ theme }) => theme.text};
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px 50px;
  align-items: center;
  border: 1px solid #232121;
  border-radius: 5px;
  background-color: #f9f9f9;
`;

const Title = styled.h1`
  font-size: 24px;
  margin: 0px;
`;

const SubTitle = styled.h3`
  font-weight: 300;
  margin: 0px;
  font-size: 18px;
`;

const Label = styled.label`
  font-size: 14px;
`;

const Input = styled.input`
  width: 100%;
  border: 1px solid #232121;
  padding: 10px;
  border-radius: 5px;
  background-color: black;
  outline: none;
  color: ${({ theme }) => theme.text};
  background: white;
  ${'' /* border-radius: 15px; */}
`;

const SignInButton = styled.button`
  width: 100%;
  border: none;
  padding: 10px;
  border-radius: 50px;
  background-color: black;
  color: white;
  outline: none;
  font-size: 16px;
  cursor: pointer;
`;

const Signin = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loading } = useSelector((state) => state.user);

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axiosInstance.post("/auth/login", { email, password });
      dispatch(loginSuccess(res.data.user));
      Swal.fire(
        `Welcome ${res.data?.user.name}`,
        "Login Successful!",
        "success"
      );
    } catch (error) {
      console.log(error);
      dispatch(loginError());
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response.data.error ||
          "Error while handling custom authentication",
      });
    }
  };

  const handleSignInWithGoogle = () => {
    dispatch(loginStart());
    signInWithPopup(auth, googleAuthProvider)
      .then(async (result) => {
        await axiosInstance
          .post("/auth/google", {
            name: result.user.displayName,
            email: result.user.email,
            img: result.user.photoURL,
          })
          .then((res) => {
            dispatch(loginSuccess(res.data.user));
            Swal.fire(
              `Welcome ${res.data?.user.name}`,
              "Login Successful!",
              "success"
            );
          });
      })
      .catch((error) => {
        console.log(error);
        dispatch(loginError());
        Swal.fire({
          icon: "error",
          title: "Error",
          text:
            error.response.data.error ||
            "Error while handling SignInWithGoogle",
        });
      });
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <Wrapper>
        <Title>Sign In</Title>
        <SubTitle>to continue to Kidtube</SubTitle>
        <Label htmlFor="email">Email:</Label>
        <Input
          type="text"
          id="email"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />
        <Label htmlFor="password">Password:</Label>
        <Input
          type="password"
          id="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <SignInButton onClick={handleLogin}>Sign In</SignInButton>
        <span>
          Don't have an account?{" "}
          <Link to="/signup" style={{ color: "inherit" }}>
            Signup
          </Link>
        </span>
        {/* <span>OR</span>
        <SignInButton onClick={handleSignInWithGoogle}>
          Sign In with Google
        </SignInButton> */}
      </Wrapper>
    </Container>
  );
};

export default Signin;
