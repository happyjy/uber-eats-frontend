import { ApolloProvider } from "@apollo/client";
import { render, waitFor, RenderResult } from "../../test-utils";
import { createMockClient, MockApolloClient } from "mock-apollo-client";
import { CreateAccount } from "../../pages/create-account";

let mockedClient: MockApolloClient;
let renderResult: RenderResult;

beforeEach(async () => {
  mockedClient = createMockClient();
  await waitFor(() => {
    mockedClient = createMockClient();
    renderResult = render(
      <ApolloProvider client={mockedClient}>
        <CreateAccount />
      </ApolloProvider>,
    );
  });
});

it("renders OK", async () => {
  await waitFor(() =>
    expect(document.title).toBe("Create Account | Uber Eats"),
  );
});
