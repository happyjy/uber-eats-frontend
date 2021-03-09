import React from 'react';
import { useForm } from 'react-hook-form';

type TLoginForm = {
  email?: string;
  password?: string;
};

export const Login = () => {
  const { register, handleSubmit, watch, errors } = useForm<TLoginForm>();

  const onSubmit = () => {
    console.log(`### onSubmit fn: ${errors.email}, ${errors.password}`);
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
            <span className="font-medium text-red-500">
              {errors.email?.message}
            </span>
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
            <span className="font-medium text-red-500">
              {errors.password?.message}
            </span>
          )}
          {errors.password?.type === 'minLength' && (
            <span className="font-medium text-red-500">
              Password must be more than 10 chars
            </span>
          )}
          <button className="btn"> Log In </button>
        </form>
      </div>
    </div>
  );
};
