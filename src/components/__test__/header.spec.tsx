import { MockedProvider } from "@apollo/client/testing";
import { render, waitFor } from "@testing-library/react";
import { ME_QUERY } from "../../hooks/useMe";
import { BrowserRouter as Router } from "react-router-dom";
import { Header } from "../header";

const mocks = [
  {
    request: {
      query: ME_QUERY,
    },
    result: {
      data: {
        me: {
          id: 1,
          email: "",
          role: "",
          verified: false,
        },
      },
    },
  },
];

it("renders verify banner", async () => {
  await waitFor(async () => {
    const { queryByText } = render(
      <MockedProvider mocks={mocks}>
        <Router>
          <Header />
        </Router>
      </MockedProvider>,
    );

    // render의 result를 기다렸다가 수행하기 위한 코드
    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(queryByText("Please verify your email"));
  });
});

const mocks1 = [...mocks];
mocks1[0].result.data.me.verified = true;

it("renders without verify banner", async () => {
  mocks;
  await waitFor(async () => {
    const { queryByText } = render(
      <MockedProvider mocks={mocks1}>
        <Router>
          <Header />
        </Router>
      </MockedProvider>,
    );

    await new Promise((resolve) => setTimeout(resolve, 0));
    expect(queryByText("Please verify your email.")).toBeNull();
  });
});
