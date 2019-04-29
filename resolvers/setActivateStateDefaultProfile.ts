
"use strict";
import { DocumentClient } from "aws-sdk/clients/dynamodb";
import Profile from "../types/profile";

export const setActivateStateDefaultProfile = async (
    account_id: string,
    activate: boolean,
    dynamoDb:DocumentClient
  ) => {
    var params = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        id: account_id,
        sort_key: `p@${Profile.DEFAULT}`,
      },
      UpdateExpression: "SET updatedAt = :updatedAt, activated = :value",
      ConditionExpression: "attribute_exists(createdAt)",
      ExpressionAttributeValues: {
        ":updatedAt": new Date().toISOString(),
        ":value": activate
      }
    };
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
  