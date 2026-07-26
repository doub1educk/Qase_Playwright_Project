Feature: Creating TestCases test

Background:
Given I am on the project page

@smoke @positive
Scenario: Succsesfull creating testCase
Given project has been creating via API
And suite has been creating via API
When I open the created project
Then I should be on the page of the created project 
When I open created suite 
And I click on dropdown menu
And I click button to create new testCase
And I enter a random title of testCase
And I select status "Draft" and severity "Major" and priority "High" and type "Functional" and layer "E2E" and is flaky "Yes" and behavior "Positive" and automation status "Manual"
And I enable checkbox "To be automated"
And I fill testCase steps:
      | action                          | data                     | expected_result                  |
      | Open the login page             |                          |  Login page is displayed         |
      | Enter valid email               | user@test.com            |  Email field is filled           |
      | Enter valid password            | Pass123!                 |  Password field is filled        |
      | Click login button              |                          |  User is redirected to dashboard |
      | Open profile page               |                          |  Profile page is displayed       |
      | Upload txt file in field "About"| .txt                     |  File was uploaded               |
      | Save changes                    |                          |  Success message is displayed    |
And I click button to save testCase
Then testCase details should match according to API
When I enable checkbox Shown as list
Then Test case steps should be correct in UI
When I come to property page of testCase
Then Test case details should be correct in UI