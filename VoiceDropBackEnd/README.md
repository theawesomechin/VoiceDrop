# Node AWS Lambda Function

## Install

Install dependencies with `yarn install`

## Deployment to AWS Lambda

1.  Zip the contents of this folder (not the folder itself).
2.  Go to AWS Lambda Console and crate a new Function
3.  Under Code entry type, select Upload a .ZIP file
4.  Rename the Handler to `index.handler`
5.  Save the function
6.  Create a test event and save the event
7.  Click test and make sure it's working

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
21. Once deployed, you will be able to grab the Invoke URL and use it for a POST request.
