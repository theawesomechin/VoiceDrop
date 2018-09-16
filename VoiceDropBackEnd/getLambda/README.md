# Node AWS Lambda Function

## Install

Install dependencies with `yarn install`

## Deployment to AWS Lambda

1.  Zip the contents of this folder (not this folder itself, make sure this is.zip not .7z).
2.  Go to AWS Lambda Console and crate a new Function
3.  Under Code entry type, select Upload a .ZIP file
4.  Rename the Handler to `index.handler`
5.  Save the function
6.  Create a test event and save the event
7.  Click test and make sure it's working
    Should display the following with the current time.
    {
      "statusCode": 200,
      "body": "{\"message\":\"Hello, the current time is 11:55:55 GMT+0000 (UTC).\"}"
    }

## Configure API Gateway

1.  Go to API Gateway console
2.  Create API named `Calculator`
3.  Create a resource `/calculator`
4.  Under `/calculator`, create method `POST`
5.  Choose Integration Type `AWS Service`
6.  Type the AWS region similar to where the lambda function is deployed (e.g. us-east-2)
7.  Choose AWS Service `Lambda`
8.  Leave AWS Subdomain blank
9.  Choose HTTP method `POST`
10. Choose Action Type `Path override` and enter the following value:  
    `/2015-03-31/functions/arn:aws:lambda:XXXX:YYYYYYYYYYYY:function:calculator/invocations`

* Where
  * `2015-03-31` is the AWS.Lambda API Version
  * `XXXX` is the region where the Lambda function is deployed (e.g. us-east-2)
  * `YYYYYYYYYYYY` is the Account ID of the AWS account. Go to My Account > Account Settings to see this value.
  * `calculator` is the name of the lambda function

11. Specify the Execution Role which can be found in IAM. If a role needs, to be create:

    * Go to IAM > Roles > Create Role > Choose Lambda > Choose API Gateway > Click Next
    * Save the Permission and notice that it will add the `AmazonAPIGatewayPushToCloudWatchLogs` policy.
    * You need to add one more policy to allow API gateway to access your lambda function. For this example, add the policy `AWSLambdaFullAccess`.

12. Leave the Passthrough to its default value `Content Handling`

16. In `/calculator - POST`, go to `Method Request`.
17. Add a Request Body of Content type `application/json` and Model name `Input`.
18. You can now test the `POST` method if it works correctly.
19. Go to Actions, `Deploy API`
20. Select a development stage then `Deploy`
21. This will redirect you to the stage editor, on the left panel drop down your stage (beta)
22. Select your function, and copy the Invoke URL

Postman
23. Install Postman https://www.getpostman.com/
23. Upon opening postman, exit the pop-up options menu
24. Make sure you select the POST method
25. Paste in your Invoke URL copied from the API Gateway and send
26. In the body, this should display the following with the current time.
    {
      "statusCode": 200,
      "body": "{\"message\":\"Hello, the current time is 11:55:55 GMT+0000 (UTC).\"}" 
    }
