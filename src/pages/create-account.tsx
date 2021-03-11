import React from 'react';
import { gql, useMutation } from '@apollo/client';
import { useForm } from 'react-hook-form';
import { FormError } from '../components/form-error';
import {
  loginMutation,
  loginMutationVariables,
} from '../__generated__/loginMutation';
import uberLogo from '../images/logo.svg';
import { Button } from '../components/button';
import { UserRole } from '../__generated__/globalTypes';
import {
  createAccountMutation,
  createAccountMutationVariables,
} from '../__generated__/createAccountMutation';
import { Link } from 'react-router-dom';

const CREATE_ACCOUNT_MUTATION = gql`
  mutation createAccountMutation($createAccountInput: CreateAccountInput!) {
    createAccount(input: $createAccountInput) {
      ok
      error
    }
  }
`;

type ICreateAccountForm = {
  email: string;
  password: string;
  role: UserRole;
};

export const CreateAccount = () => {
  const {
    register,
    getValues,
    handleSubmit,
    watch,
    errors,
    formState,
  } = useForm<ICreateAccountForm>({
    mode: 'onChange',
    defaultValues: {
      role: UserRole.Client,
    },
  });
  const [
    createAccountMutation,
    { data: createAccountMutationResult, loading },
  ] = useMutation<createAccountMutation, createAccountMutationVariables>(
    CREATE_ACCOUNT_MUTATION,
    {
      onError: (error) => {
        console.log(`### onError: ${error}`);
      },
    },
  );
  const onSubmit = () => {
    console.log(`### onSubmit fn: ${errors.email}, ${errors.password}`);
    const { email, password, role } = getValues();
    createAccountMutation({
      variables: {
        createAccountInput: {
          email,
          password,
          role,
        },
      },
    });
  };

  return (
    <div className="h-screen flex flex-col items-center mt-10 lg:mt-28">
      <div className="w-full max-w-screen-sm flex flex-col items-center px-5">
        <img src={uberLogo} className="w-52 mb-10"></img>
        <h4 className="w-full text-left text-3xl font-medium mb-5">
          Let's get started
        </h4>
        <form
          className="w-full grid gap-3 mt-5 px-5 mb-5"
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
          <select
            name="role"
            ref={register({ required: true })}
            className="input"
          >
            {Object.keys(UserRole).map((role, index) => (
              <option key={index}>{role}</option>
            ))}
          </select>
          <Button
            canClick={formState.isValid}
            loading={false}
            actionText={'Create Account'}
          />
        </form>
        <div>
          Already have an account?{' '}
          <Link to="/login" className="text-lime-600 hover:underline">
            Log in now
          </Link>
        </div>
      </div>
    </div>
  );
};
