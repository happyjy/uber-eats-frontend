import { gql, useApolloClient, useMutation } from "@apollo/client";
import React from "react";
import { Helmet } from "react-helmet-async";
import { useForm } from "react-hook-form";
import { Button } from "../../components/button";
import { useMe } from "../../hooks/useMe";
import {
  editProfile,
  editProfileVariables,
} from "../../__generated__/editProfile";

const EDIT_PROFILE_MUTATION = gql`
  mutation editProfile($input: EditProfileInput!) {
    editProfile(input: $input) {
      ok
      error
    }
  }
`;
interface IFormProps {
  email?: string;
  password?: string;
}
export const EditProfile = () => {
  const { data: userData, refetch: refreshUser } = useMe();
  const client = useApolloClient();
  const onCompleted = async (data: editProfile) => {
    const {
      editProfile: { ok },
    } = data;
    if (ok && userData) {
      await refreshUser();
      // update the cache
      // const {
      //   me: { email: prevEmail, id },
      // } = userData;
      // const { email: newEmail } = getValues();
      // if (prevEmail !== newEmail) {
      //   client.writeFragment({
      //     id: `User:${id}`,
      //     fragment: gql`
      //       fragment EditUser on User {
      //         email
      //         verified
      //       }
      //     `,
      //     data: {
      //       email: newEmail,
      //       verified: false,
      //     },
      //   });
      // }
    }
  };
  const [editProfile, { loading }] = useMutation<
    editProfile,
    editProfileVariables
  >(EDIT_PROFILE_MUTATION, {
    onCompleted,
  });

  const { register, handleSubmit, getValues, formState } = useForm<IFormProps>({
    mode: "onChange",
    defaultValues: {
      email: userData?.me.email,
    },
  });

  const onSubmit = () => {
    const { email, password } = getValues();
    editProfile({
      variables: {
        input: {
          email,
          ...(password !== "" && { password }),
        },
      },
    });
  };

  return (
    <div className="mt-52 flex flex-col justify-center items-center">
      <Helmet>
        <title>Edit Profile | Uber Eats</title>
      </Helmet>
      <h4 className="font-semibold text-2xl mb-3">Edit Profile</h4>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-screen-sm w-full grid gap-3 mt-5 mb-5"
      >
        <input
          ref={register({
            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          })}
          name="email"
          type="email"
          className="input"
          placeholder="Email"
        />
        <input
          ref={register}
          name="password"
          type="password"
          className="input"
          placeholder="Password"
        />
        <Button
          loading={loading}
          canClick={formState.isValid}
          actionText="Save Profile"
        />
      </form>
    </div>
  );
};
