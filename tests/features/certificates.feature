Feature: Certificates Management
  As a logged-in user I want to manage my credentials and certifications.

  Background:
    Given I am logged in and on the Certificates page

  Scenario: Page title shows Credentials and Certs
    Then the page heading should contain "Credentials"

  Scenario: Empty state when no certificates exist
    Given the certificates list is empty
    Then I should see "No active credentials found."

  Scenario: Add certificate button is visible
    Then I should see an "UPLOAD CERTIFICATE" button

  Scenario: Clicking upload certificate opens a modal
    When I click "UPLOAD CERTIFICATE"
    Then a modal should appear with title "NEW CREDENTIAL UPLOAD"

  Scenario: Certificate cards show name and issuer
    Given at least one certificate exists
    Then each certificate card should show the cert name
    And each card should show "ISSUER:" label

  Scenario: Edit button opens edit modal
    Given at least one certificate exists
    When I hover over the first certificate card
    And I click the edit icon on the first card
    Then a modal should appear with title "REISSUE CREDENTIAL"
