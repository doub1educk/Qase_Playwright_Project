Feature: Creating projects tests

Background: 
Given I am on the project page 

@regression @positive
Scenario: Succsesfull creating project 
Given Random data has been prepared for the new project
When I click button to creating a new project 
And I enter a title of project 
And I enter a code for project 
And I click button to submit creating
Then I should be on the page of the created project 
When I click on the projects button in header 
Then Project should be appears in the project list
