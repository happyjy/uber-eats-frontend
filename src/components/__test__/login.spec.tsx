import { ApolloProvider } from "@apollo/client";
import { createMockClient } from "mock-apollo-client";
import { render, RenderResult, waitFor } from "@testing-library/react";
import { Login } from "../../pages/login";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import userEvent from "@testing-library/user-event";

// describe("<Login />", () => {
// });
let renderResult: RenderResult;
beforeEach(async () => {
  await waitFor(async () => {
    const mockedClient = createMockClient();
    renderResult = render(
      <HelmetProvider>
        <Router>
          <ApolloProvider client={mockedClient}>
            <Login />
          </ApolloProvider>
        </Router>
      </HelmetProvider>,
    );
  });
});

it("should render OK", async () => {
  await waitFor(() => {
    expect(document.title).toBe("Login | Uber Eats");
  });
});

it("display email validation errors", async () => {
  const { getByPlaceholderText, debug, getByRole } = renderResult;
  const email = getByPlaceholderText(/email/i);
  await waitFor(() => {
    userEvent.type(email, "this@wontExcute");
  });
  let errorMessage = getByRole("alert");
  expect(errorMessage).toHaveTextContent(/please enter a valid email/i);
  await waitFor(() => {
    userEvent.clear(email);
  });
  debug();
});
