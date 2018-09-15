'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk);
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
	console.log(event);
	const response = {
		statusCode: 200,
		bode: JSON.stringify({
			message 'Hello, the current time is ${new Date().toTimeString()}.',
		}),
	};
	callback(null, response);
}
