const AWS =  require('aws-sdk');

const documentClient = new AWS.DynamoDB.DocumentClient();


module.exports = {
    async get(ID, TableName) {
        const params = {
            TableName, 
            Key: {
                ID
            }
        }
        const data = await documentClient
            .get(params)
            .promise()

        if (!data || !data.Item) {
            throw Error('Error fetching data');
        }

        return data.Item;
    }
}


module.exports = {
    async write(data, TableName) {
        if (!data.ID) {
            throw Error('no ID on the data');
        }

        const params = {
            TableName,
            Item: data,
        };

        const res = await documentClient.put(params).promise();

        if (!res) {
            throw Error(`There was an error inserting ID of ${data.ID} in table ${TableName}`);
        }

        return data;
    }, 
}