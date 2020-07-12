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
