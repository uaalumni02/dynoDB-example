"use strict";
const Dynamo = require("./lib/Dynamo");

const { tableName } = process.env;

module.exports.getUser = async (event) => {
  const { pathParameters } = event;
  const { id } = pathParameters;

  const userInfo = await Dynamo.get(id, tableName).catch((err) => {
    console.log(err);
    return null;
  });

  if (!userInfo) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Unable to get user data" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      data: userInfo,
    }),
  };
};

module.exports.addUser = async (event) => {
  if (!event.pathParameters || !event.pathParameters.id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "missing the ID from the path" }),
    };
  }

  let ID = event.pathParameters.id;
  const user = JSON.parse(event.body);
  user.ID = ID;

  const newUser = await Dynamo.write(user, tableName).catch((err) => {
    console.log("error in dynamo write", err);
    return null;
  });

  if (!newUser) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Failed to write user by ID" }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      newUser,
    }),
  };
};

module.exports.deleteUser = async (event) => {
  const { pathParameters } = event;
  const { id } = pathParameters;
  const deleteResponse = await Dynamo.delete(id, tableName).catch(
    (err) => null
  );

  if (!deleteResponse) {
    return {
      statusCode: 400,
      body: JSON.stringify({ success: false }),
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      success: true,
    }),
  };
};


var AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

var table = "users";

var ID = '2';

module.exports.updateUser = async (event) => {
  console.log(event)
  var params = {
    TableName: table,
    Key: {
      ID
    },
    UpdateExpression: "set email = :e, firstName=:f",
    ExpressionAttributeValues: {
      ":e": "dbell@yahoo.com",
      ":f": "meco",
    },
    ReturnValues: "ALL_NEW",
  };

  console.log("Updating the item...");
  documentClient.update(params, function (err, data) {
    if (err) {
      console.error(
        "Unable to update item. Error JSON:",
        JSON.stringify(err, null, 2)
      );
    } else {
      console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
    }
  });
};
