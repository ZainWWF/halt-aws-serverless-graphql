"use strict";

import Profile from "../types/profile";



export const createDefaultProfile = async (_, { account_id }, { dynamoDb }) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: account_id,
      sort_key: `p@${Profile.DEFAULT}`,
      onhand: 0,
      pending: 0,
      origins: [],
      activated: true,
      createdAt: new Date().toISOString()
    },
    ConditionExpression: "NOT contains(sort_key, :profile)",
    ExpressionAttributeValues: {
      ":profile": `p@${Profile.DEFAULT}`,
    }
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      account_id,
      result: "OK"
    };
  } catch (error) {
    return {
      account_id,
      result: error
    };
  }
};
