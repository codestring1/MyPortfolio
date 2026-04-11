Feature: Authentication
  As a user I want to log in and register securely.

  Scenario: Successful login with valid credentials
    Given I am on the Login page
    When I enter a valid email and password
    And I click the login submit button
    Then I should be redirected to the Home dashboard

  Scenario: Login with wrong password shows error
    Given I am on the Login page
    When I enter email "test@test.com" and password "wrongpassword"
    And I click the login submit button
    Then I should see a login error message

  Scenario: Login with empty fields does not submit
    Given I am on the Login page
    Then the login submit button should require email and password

  Scenario: Signup form shows OTP screen after submission
    Given I am on the Signup page
    When I enter email "newuser999@example.com" and password "NewPass123!"
    And I click the signup submit button
    Then I should see "Verification Required" on the screen

  Scenario: Signup page has link to Login
    Given I am on the Signup page
    Then I should see a link to "Initialize Session"

  Scenario: Login page has link to Signup
    Given I am on the Login page
    Then I should see a link to "Register Here"

  Scenario: Forgot password page is reachable
    Given I am on the Login page
    When I click "Reset Password"
    Then I should be on the Forgot Password page
