Feature: Skills Management
  As a logged-in user I want to manage my technical skills.

  Background:
    Given I am logged in and on the Skills page

  Scenario: Page title shows Capability Matrix
    Then the page heading should contain "Capability Matrix"

  Scenario: Empty state message when no skills
    Given the skills list is empty
    Then I should see "No capabilities logged."

  Scenario: Add button opens the skill modal
    When I click "NEW SKILL"
    Then a modal dialog should appear with title "LEARN NEW SKILL"

  Scenario: Cancel modal closes without saving
    When I click "NEW SKILL"
    And I close the modal
    Then the modal should not be visible

  Scenario: Skills list shows skill name and level badges
    Given at least one skill exists in the list
    Then each skill card should display a name and a proficiency badge
