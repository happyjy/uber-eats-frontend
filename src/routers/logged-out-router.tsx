import React from 'react';
import { useForm } from 'react-hook-form';

export const LoggedOutRouter = () => {
  const { register, watch, handleSubmit, errors } = useForm();

  const onSubmit = () => {
    console.log('### watch', watch());
  };
  const onInvalid = () => {
    console.log('### cant create account');
  };
  console.log('### errors: ', errors);

  return (
    <div>
      <h1> Logged Out </h1>
      <form onSubmit={handleSubmit(onSubmit, onInvalid)}>
        <div>
          <input
            ref={register({
              required: 'This is requred',
              pattern: /^[A-Za-z0-9._%+-]+@gmail.com$/,
            })}
            name="email"
            type="email"
            placeholder="email"
          />
        </div>
        <div>
          <input
            ref={register({
              required: true,
            })}
            name="password"
            type="password"
            required
            placeholder="password"
          />
        </div>
        <button className="bg-yellow-200 text-white"> Submit </button>
      </form>
    </div>
  );
};
