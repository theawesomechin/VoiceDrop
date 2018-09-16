'use strict';

const uuid = require('uuid/v1');
const AWS = require('aws-sdk');
// const dynamoDB = new AWS.DynamoDB.DocumentClient();
const s3 = new AWS.S3();

const AWS_REGION = "us-east-1";
const S3_BUCKET_NAME = "voicedrop-audio-recordings";
AWS.config.update({region: AWS_REGION});
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
const RECORDING_TABLE_NAME = "recordings";

exports.handler = (event, context, callback) => {
	postData(event, context, callback);
	const response = {
		statusCode: 200
	};

	return callback(null, response);
};

function postData(event, context, callback) {
	let encodedData;
	if (event.voiceClip === undefined) {
		exitAsInternalServerError("ERROR: voiceClip undefined", callback);
	} else {
		encodedData = event.voiceClip;
	}
	
	let decodedData = Buffer.from(encodedData, 'base64');
	let s3Upload = uuid();
	try {
		s3Upload = uploadDataToS3(decodedData);
		addToDynamoDB(event.longitude, event.latitude, event.userName, s3Upload);
	} catch (err) {
		exitAsInternalServerError(err, callback);
	}
}

function uploadDataToS3(dataToUpload) {
 	var filePath = uuid() + '.jpg';
	var params = {
		"Body": dataToUpload,
		"Bucket": S3_BUCKET_NAME,
		"Key": filePath  
	};
	   
	s3.upload(params, (err, data) => {
		if(err) {
			throw err;
		}
	});

	return filePath;
}

function addToDynamoDB(longitude, latitude, name, s3Path) {
	const recordingRelation = {
	  TableName: RECORDING_TABLE_NAME,
	  Item: {
	  	'timestamp' : {N: Date.now().toString()},
	    'longitude' : {N: longitude.toString()},
	    'latitude' : {N: latitude.toString()},
	    'name' : {S: name || 'unknown'},
	    'voteCount' : {N: '0'},
	    's3Link' : {S: s3Path},
	  }
	};
	
	// Call DynamoDB to add the item to the table
	ddb.putItem(recordingRelation, function(err, data) {
	  if (err) {
	    throw err;
	  }
	});
}

function exitAsInternalServerError(err, callback) {
	callback(err, {"statusCode": 500});
}

