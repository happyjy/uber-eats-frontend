describe("Log In", () => {
  const user = cy;
  it("should see login email, password validation errors", () => {
    user.visit("/");
    user.findByText(/create an account/i).click();
    user.findByPlaceholderText(/email/i).type("x@x");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("x@gmail.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });
  it("can see email / password validation errors", () => {
    user.intercept("http://localhost:4000/graphql", (req) => {
      const { operationName } = req.body;
      if (operationName && operationName === "createAccountMutation") {
        req.reply((res) => {
          res.send({
            data: {
              createAccount: {
                ok: true,
                error: null,
                __typename: "CreateAccountOutput",
              },
            },
          });
        });
      }
    });
    user.visit("/create-account");
    user.findByPlaceholderText(/email/i).type("jyoon@gmail.com");
    user.findByPlaceholderText(/password/i).type("121212");
    user.findByRole("button").click();

    user.wait(1000);

    // @ts-ignore
    user.login("happyUberClient@gmail.com", "123123123");
  });
});
