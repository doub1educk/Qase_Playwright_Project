Feature: login tests

Background:
Given I am on the login page

@regression @positive
Scenario: Succesfull login
When I enter email from ENV file
And I enter password from ENV file
And I click on the login button with correct credentials
Then I should be on the projects page

@regression @negative
Scenario: Failed login wuth incorrect password
When I enter email from ENV file
And I enter wrong password
And I click on the login button with incrorect credentials
Then I should stay on the login page
And I should see login error alert "These credentials do not match our records."