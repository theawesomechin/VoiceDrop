'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = (event, context, callback) => {
	var bucketName = process.env.S3_BUCKET;
	console.log(bucketName);
	console.log(event);
	if(event.endpoint === 'postData') {
		postData(event, context, callback);
	} else if (event.endpoint === 'getData') {
		getData(event, context, callback);
	}
	const response = {
		statusCode: 200
	};

	return callback(null, response);
}

function postData(event, context, callback) {
	console.log("Putting!");
}

function getData(event, context, callback) {
	console.log("Getting!");
}
