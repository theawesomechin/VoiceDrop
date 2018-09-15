# Node AWS Lambda Calculator Function

This is the second part of my Node AWS Lambda series (Here is part 1: https://github.com/Gurenax/node-aws-lambda-function).

This app demonstrates how to create a calculator function in AWS lambda and configure it as a POST request in the API Gateway. Unlike the API Gateway in part 1, this will not be configured as a trigger. It will be manually configured in the API Gateway.

## `index.js`

```javascript
const R = require('ramda')

exports.handler = (event, context, callback) => {
  console.log('Received event:', JSON.stringify(event, null, 2))
  if (
    event.a === undefined ||
    event.b === undefined ||
    event.op === undefined
  ) {
    callback('400 Invalid Input')
  }
  if (isNaN(event.a) || isNaN(event.b)) {
    callback('400 Invalid Operand')
  }
  try {
    const response = calculate(event)
    callback(null, response)
  } catch (error) {
    callback(error)
  }
}

// Best practice to separate functions from handler
const calculate = params => {
  let result = 0
  switch (params.op) {
    case '+':
    case 'add':
      result = R.add(params.a, params.b)
      break
    case '-':
    case 'sub':
      result = R.subtract(params.a, params.b)
      break
    case '*':
    case 'mul':
      result = R.multiply(params.a, params.b)
      break
    case '/':
    case 'div':
      result = R.divide(params.a, params.b)
      break
    default:
      throw new Error('400 Invalid Operator')
  }
  return {
    a: params.a,
    b: params.b,
    op: params.op,
    result: result
  }
}
```

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

13. Under APIs > Calculator, go to `Models`
14. Create a new model `Input` with Content type `application/json`
15. Paste the following to its Model schema:

```javascript
{
    "type":"object",
    "properties":{
        "a":{"type":"number"},
        "b":{"type":"number"},
        "op":{"type":"string"}
    },
    "title":"Input"
}
```

16. In `/calculator - POST`, go to `Method Request`.
17. Add a Request Body of Content type `application/json` and Model name `Input`.
18. You can now test the `POST` method if it works correctly.
19. Go to Actions, `Deploy API`
20. Select a development stage then `Deploy`
21. Once deployed, you will be able to grab the Invoke URL and use it for a POST request.

22. Execute the URL with the body parameters:
```javascript
{
  "a": 1,
  "b": 2,
  "op": "+"
}
```

23. The output should receive the following data:
```javascript
{
  "a": 1,
  "b": 2,
  "op": "+",
  "result": 3
}
```

## Securing the API method with an API Key
1. Under the `/calculator - POST` setting, select `Method Request`.
2. Change the `API Key Required` to true.
3. Create a `Usage Plan` called `Basic`.
4. Create an `API Key` and Add it to usage plan Basic.
5. Save and re-deploy the Calculator API
6. When accessing the invoke URL, specify the request header `X-API-KEY` and use the API key generated in Step 4.