'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
	console.log(event);
	if(event.context['https-method'] === 'POST') {
		postData(event, context, callback);
	} else if (event.context['https-method'] === 'GET') {
		getData(event, context, callback);
	}
	const response = {
		statusCode: 200
	};

	return callback(null, response);
}

function putData(event, context, callback) {
	console.log("Putting!");
}

function getData(event, context, callback) {
	console.log("Getting!");
}
