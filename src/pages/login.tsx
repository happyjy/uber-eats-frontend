import React from "react";
import { gql, useMutation } from "@apollo/client";
import { useForm } from "react-hook-form";
import { FormError } from "../components/form-error";
import {
  loginMutation,
  loginMutationVariables,
} from "../__generated__/loginMutation";
import uberLogo from "../images/logo.svg";
import { Button } from "../components/button";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { authTokenVar, isLoggedInVar } from "../apollo";
import { LOCALSTORAGE_TOKEN } from "../constants";

export const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $loginInput) {
      ok
      token
      error
    }
  }
`;
type TLoginForm = {
  email: string;
  password: string;
  resultError?: string;
};

export const Login = () => {
  const {
    register,
    getValues,
    handleSubmit,
    errors,
    formState,
    // watch,
  } = useForm<TLoginForm>({
    mode: "onChange",
  });
  // const history = useHistory();
  const onCompleted = (data: loginMutation) => {
    const {
      login: { /* error, */ ok, token },
    } = data;

    console.log("### login > onCompleted > data: ", data);

    if (ok && token) {
      localStorage.setItem(LOCALSTORAGE_TOKEN, token);
      authTokenVar(token);
      isLoggedInVar(true);
      // history.push("/");
      console.log(`### login > onComleted > token: ${token}`);
    }
  };
  const [loginMutation, { data: loginMutationResult, loading }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError: (error) => {
      console.log(`### onError: ${error}`);
    },
  });
  const onSubmit = () => {
    const { email, password } = getValues();
    console.log(`### login > onSubmit > email, pw: ${email}, ${password}`);
    loginMutation({
      variables: {
        loginInput: {
          email,
          password,
        },
      },
    });
  };

  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
      <Helmet>
        <title> Login | Uber Eats </title>
      </Helmet>
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={uberLogo} className="w-52 mb-10" alt="Nuber Eats"></img>
        <h4 className="w-full text-left text-3xl font-medium mb-5">
          {" "}
          Welcome back
        </h4>
        <form
          className="w-full grid gap-3 mt-5 px-5 mb-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({
              required: "Email is required",
              pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
            })}
            name="email"
            type="email"
            placeholder="Email"
            className="input"
            required
          ></input>
          {errors.email?.type === "pattern" && (
            <FormError errorMessage={"Please enter a valid email"} />
          )}
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message} />
          )}
          <input
            ref={register({ required: "Password is required" })}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
            required
          ></input>
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message} />
          )}
          <Button
            canClick={formState.isValid}
            loading={loading}
            actionText="Log In"
          ></Button>
          {loginMutationResult?.login.error && (
            <FormError errorMessage={loginMutationResult?.login.error} />
          )}
        </form>
        <div>
          New to Nuber?{" "}
          <Link to="/create-account" className="text-lime-600 hover:underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
};
