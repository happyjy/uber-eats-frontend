describe("Edit Profile", () => {
  const user = cy;
  beforeEach(() => {
    // @ts-ignore
    user.login("happyUberClient@gmail.com", "123123123");
  });
  it("can go to /edit-profile using the header", () => {
    user.get('a[href="/edit-profile"]').click();
    user.wait(2000);
    user.title().should("eq", "Edit Profile | Uber Eats");
  });
  it("can change email", () => {
    user.intercept("POST", "http://localhost:4000/graphql", (req) => {
      if (req.body?.operationName === "editProfile") {
        // @ts-ignore
        req.body?.variables?.input?.email = "happyUberClient@gmail.com";
      }
    });
    user.visit("/edit-profile");
    user
      .findByPlaceholderText(/email/i)
      .clear()
      .type("happyUberClient1@gmail.com");
    user.findByRole("button").click();
  });
});
