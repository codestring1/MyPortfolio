Feature: Experience Management
  As a logged-in user I manage my work experience entries.

  Background:
    Given I am logged in and on the Experience page

  Scenario: Page heading is visible
    Then the page heading should contain "Experience"

  Scenario: Empty state when no experience exists
    Given the experience list is empty
    Then I should see empty state text on the screen

  Scenario: Add Experience button opens modal
    When I click the add button on the page
    Then a modal dialog should appear

  Scenario: Cancel closes modal
    When I click the add button on the page
    And I close the modal
    Then the modal should not be visible

  Scenario: Experience cards show company and role
    Given at least one experience entry exists
    Then each experience card should display company and role information
