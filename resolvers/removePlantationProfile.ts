export const removePlantationProfile = async (
  _,
  { account_id, plantation_id },
  { dynamoDb }
) => {

  var params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: account_id,
      sort_key: plantation_id
    },
    ConditionExpression: 'transferCount = :transferCount',
    ExpressionAttributeValues: {
      ":transferCount": 0,
    }
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      plantation_id,
      result: "OK"
    };
  } catch (error) {
    return {
      plantation_id,
      result: new Error(error.message)
    };
  }
};
