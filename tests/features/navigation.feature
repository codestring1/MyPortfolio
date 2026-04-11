Feature: Navigation
  As a logged-in user I can navigate to all sections of the app via the sidebar.

  Background:
    Given I am logged in and on the Home dashboard

  Scenario: Navigate to Skills via sidebar
    When I click "Skills" in the sidebar navigation
    Then the URL should contain "/skills"
    And the page heading should contain "Capability Matrix"

  Scenario: Navigate to Certificates via sidebar
    When I click "Certificates" in the sidebar navigation
    Then the URL should contain "/certificates"
    And the page heading should contain "Credentials"

  Scenario: Navigate to Experience via sidebar
    When I click "Experience" in the sidebar navigation
    Then the URL should contain "/experience"

  Scenario: Navigate to Projects via sidebar
    When I click "Projects" in the sidebar navigation
    Then the URL should contain "/projects"

  Scenario: Unauthenticated user redirected from protected route
    Given I am NOT logged in
    When I navigate directly to "/skills"
    Then I should be redirected to the Login page
