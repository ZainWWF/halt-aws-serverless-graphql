import Profile from "../types/profile";

export const updateDefaultProfile = async (
  _,
  { account_id, onhand, pending, origins },
  { dynamoDb }
) => {
  if (!onhand && !pending) {
    throw new Error("required attributes not defined"!);
  }

  var params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: account_id,
      sort_key: `p@${Profile.DEFAULT}`
    },
    UpdateExpression: "SET updatedAt = :updatedAt,",
    ConditionExpression:
      "attribute_exists(createdAt) and activated = :activated",
    ExpressionAttributeValues: {
      ":updatedAt": new Date().toISOString(),
      ":activated": true
    }
  };

  if (onhand) {
    params.UpdateExpression = `${params.UpdateExpression} onhand = :onhand`;
    params.ExpressionAttributeValues = Object.assign(
      {},
      params.ExpressionAttributeValues,
      { ":onhand": onhand }
    );
    if (pending) {
      params.UpdateExpression = `${params.UpdateExpression},`;
    }
  }

  if (pending) {
    params.UpdateExpression = `${params.UpdateExpression} pending = :pending`;
    params.ExpressionAttributeValues = Object.assign(
      {},
      params.ExpressionAttributeValues,
      { ":pending": pending }
    );
    if (origins) {
      params.UpdateExpression = `${params.UpdateExpression},`;
    }
  }

  if (origins) {
    params.UpdateExpression = `${params.UpdateExpression} origins = :origins`;
    params.ExpressionAttributeValues = Object.assign(
      {},
      params.ExpressionAttributeValues,
      { ":origins": origins }
    );
  }
  try {
    await dynamoDb.update(params).promise();
    return {
      account_id,
      result: "OK"
    };
  } catch (error) {
    return {
      account_id,
      result: new Error(error.message)
    };
  }
};
