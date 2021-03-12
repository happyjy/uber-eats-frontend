import { gql, useMutation } from "@apollo/client";
import React, { useEffect } from "react";
import {
  verifyEmail,
  verifyEmailVariables,
} from "../../__generated__/verifyEmail";

const VERIFY_EMAIL_MUTATION = gql`
  mutation verifyEmail($input: VerifyEmailInput!) {
    verifyEmail(input: $input) {
      ok
      error
    }
  }
`;

export const ConfirmEmail = () => {
  const [verifyEmail, { loading: verifyingEmail }] = useMutation<
    verifyEmail,
    verifyEmailVariables
  >(VERIFY_EMAIL_MUTATION);
  // # email로 email confirm하는 link 이메일이 전송되고 클릭하면 자동으로 confirm 되는 것이 기획
  //   ㄴ 그래서 현재 화면이 화면이 loading 다 되면 verifyEmail query를 req
  // # useEffect
  // 1. ComponentDidMount(두번째 파라미터에 아무것도 사용하지 않을 때)
  // 2. useEffect 두번째 파라미터에 따라서 달라진다.
  useEffect(() => {
    const [_, code] = window.location.href.split("code=");
    console.log("### confirm-email > code: ", code);
    verifyEmail({
      variables: {
        input: {
          code,
        },
      },
    });
  });
  return (
    <div className="mt-52 flex flex-col items-center justify-center">
      <h2 className=" text-lg mb-1 font-medium">Confriming email...</h2>
      <h4 className=" text-gray-700 text-sm">
        Please wait, don't close this page...
      </h4>
    </div>
  );
};
