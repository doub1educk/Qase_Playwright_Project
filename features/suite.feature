Feature: Creating suite tests

Background:
Given I am on the project page 

@regression @positive
Scenario: Succsesfull creating suite 
Given project has been creating via API
When I open the created project
Then I should be on the page of the created project 
When I click button to creating a new suite
And I enter a title of suite
And I click button to submit creating testCase
Then Suite should be appears in the suites list
And Suite should exist according to API