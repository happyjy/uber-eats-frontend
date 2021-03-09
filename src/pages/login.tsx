import React from 'react';

export const Login = () => {
  return (
    <div className="h-screen flex items-center justify-center bg-gray-800">
      <div className="bg-white w-full max-w-lg py-10 rounded-lg text-center">
        <h3 className="text-2xl text-gray-800"> Log In </h3>
        <form className="flex flex-col mt-5 px-5">
          <input
            placeholder="Email"
            className="bg-gray-100 py-3 px-5 rounded-lg shadow-inner border-2 focus:outline-none focus:border-green-600 focus:border-opacity-60 mb-3"
          ></input>
          <input
            placeholder="Password"
            className="bg-gray-100 py-3 px-5 rounded-lg shadow-inner border-2 focus:outline-none focus:border-green-600 focus:border-opacity-60  "
          ></input>
          <button> Log In </button>
        </form>
      </div>
    </div>
  );
};
