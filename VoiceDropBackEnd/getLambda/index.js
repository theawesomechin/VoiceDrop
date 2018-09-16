'use strict';

const AWS = require('aws-sdk');
const s3 = new AWS.S3();

const AWS_REGION = "us-east-1";
const S3_BUCKET_NAME = "voicedrop-audio-recordings";
AWS.config.update({region: AWS_REGION});
const ddb = new AWS.DynamoDB({apiVersion: '2012-10-08'});
const RECORDING_TABLE_NAME = "recordings";

exports.handler = (event, context, callback) => {
	const {latitude, longitude} = event;

	return queryDynamoDB(longitude, latitude)
		.then(recordings => callback(null, recordings))
		.catch(callback);

};

const queryDynamoDB = (longitude, latitude) => scandb(latitude, longitude)
	.then(recording => {
		const fileCalls = recording.Items.map(item => downloadDataFroms3(item.s3Link.S));
		const files = Promise.all(fileCalls)
		return {recording, files};
	})
	.then(({recordings, files}) => files.map((file, i) => Object.assign({}, recordings.Items[i], {audioClip: file})))
	.catch(err => console.log('error occured:', err));

const scandb = (longitude, latitude) => new Promise((resolve, reject) => {
    
    var params=  {
        TableName:RECORDING_TABLE_NAME,
        FilterExpression:'(longitude BETWEEN :long1 and :long2) and (latitude BETWEEN :lat1 and :lat2)',
        ExpressionAttributeValues:{ 
            ":long1" : {'N': (longitude - 0.5).toString()},
            ":long2" : {'N': (longitude + 0.5).toString()},
            ":lat1" : {'N': (latitude - 0.5).toString()},
            ":lat2" : {'N': (latitude + 0.5).toString()}
        }
	};

    ddb.scan(params, (err, data) => {
		if (err) return reject(err);
		console.log('params', params);
		console.log('datatatatata', data)
		resolve(data);
    });
});

const downloadDataFroms3 = uuid => new Promise((resolve, reject) => {
	s3.getObject({Bucket: S3_BUCKET_NAME, key: uuid}, (err, data) => {
		if (err) return reject(err);
		resolve(data.toString('base64'));
	})
});

