describe("Log In", () => {
  const user = cy;
  it("should see login page", () => {
    cy.visit("/").title().should("eq", "Login | Uber Eats");
  });
  it("can see email / password validation errors", () => {
    user.visit("/");
    user.findByPlaceholderText(/email/i).type("bad@email");
    user.findByRole("alert").should("have.text", "Please enter a valid email");
    user.findByPlaceholderText(/email/i).clear();
    user.findByRole("alert").should("have.text", "Email is required");
    user.findByPlaceholderText(/email/i).type("bad@email.com");
    user
      .findByPlaceholderText(/password/i)
      .type("a")
      .clear();
    user.findByRole("alert").should("have.text", "Password is required");
  });
  it("can fill out the form and log in", () => {
    // @ts-ignore
    user.login("happyUberClient@gmail.com", "123123123");
  });
  it("sign up", () => {
    user.visit("/create-account");
  });
});
