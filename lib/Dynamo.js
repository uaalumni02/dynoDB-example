const AWS = require("aws-sdk");

const documentClient = new AWS.DynamoDB.DocumentClient();

module.exports = {
  async get(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };
    const data = await documentClient.get(params).promise();

    if (!data || !data.Item) {
      throw Error("Error fetching data");
    }

    return data.Item;
  },
  async write(data, TableName) {
    if (!data.ID) {
      throw Error("no ID on the data");
    }

    const params = {
      TableName,
      Item: data,
    };

    const res = await documentClient.put(params).promise();

    if (!res) {
      throw Error(
        `There was an error inserting ID of ${data.ID} in table ${TableName}`
      );
    }

    return data;
  },

  async delete(ID, TableName) {
    const params = {
      TableName,
      Key: {
        ID,
      },
    };
    const res = await documentClient.delete(params).promise();

    if (!res) {
      throw Error("Error deleting item");
    }
    return res;
  },
  //   async update(ID, TableName) {
  //     const params = {
  //       TableName,
  //       Key: {
  //         ID,
  //       },
  //     };
  //     const res = await documentClient.update(params).promise();

  //     if (!res) {
  //       throw Error("Error updating item");
  //     }
  //     return res;
  //   },
  // };
};
