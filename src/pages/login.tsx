import { gql, useMutation } from '@apollo/client';
import React from 'react';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';

const LOGIN_MUTATION = gql`
  mutation loginMutation($loginInput: LoginInput!) {
    login(input: $LoginInput) {
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
    watch,
    getValues,
    handleSubmit,
    errors,
  } = useForm<TLoginForm>();
  const onCompleted = (data: loginMutation) => {
    const {
      login: { error, ok, token },
    } = data;

    if (ok) {
      console.log(`### onComleted: ${token}`);
    }
  };
  const [loginMutation, { data: loginMutationResult }] = useMutation<
    loginMutation,
    loginMutationVariables
  >(LOGIN_MUTATION, {
    onCompleted,
    onError: (error) => {
      console.log(`### onError: ${error}`);
    },
  });
  const onSubmit = () => {
    console.log(`### onSubmit fn: ${errors.email}, ${errors.password}`);
    const { email, password } = getValues();
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
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg pt-10 pb-7 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800"> Log In </h3>
        <form
          className="grid gap-3 mt-5 px-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <input
            ref={register({ required: 'Email is required' })}
            name="email"
            type="email"
            placeholder="Email"
            className="input"
            required
          ></input>
          {errors.email?.message && (
            <FormError errorMessage={errors.email?.message}></FormError>
          )}
          <input
            ref={register({ required: 'Password is required', minLength: 10 })}
            name="password"
            type="password"
            placeholder="Password"
            className="input"
            required
          ></input>
          {errors.password?.message && (
            <FormError errorMessage={errors.password?.message}></FormError>
          )}
          {errors.password?.type === 'minLength' && (
            <FormError errorMessage="Password must be more than 10 chars."></FormError>
          )}
          <button className="btn"> Log In </button>
          {loginMutationResult?.login.error && (
            <FormError
              errorMessage={loginMutationResult?.login.error}
            ></FormError>
          )}
        </form>
      </div>
    </div>
  );
};
