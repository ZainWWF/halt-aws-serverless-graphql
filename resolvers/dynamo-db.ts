"use strict";
import { DynamoDB } from "aws-sdk";
import * as uuidv4 from "uuid/v4";
import Profile from "../types/profile";

const dynamoDb = new DynamoDB.DocumentClient({
  region: "localhost",
  endpoint: "http://localhost:8000"
});

export const createDefaultProfile = async ({ account_id }: any) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: account_id,
      sort_key: Profile.DEFAULT,
      onhand: 0,
      pending: 0,
      origins: [],
      activated: true,
      createdAt: new Date().toISOString()
    },
    ConditionExpression: "NOT contains(sort_key, :profile)",
    ExpressionAttributeValues: {
      ":profile": Profile.DEFAULT
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

export const setActivateStateDefaultProfile = async ({
  account_id,
  activate
}: any) => {
  var params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: account_id,
      sort_key: Profile.DEFAULT
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

export const updateDefaultProfile = async ({
  account_id,
  onhand,
  pending,
  origins
}: any) => {
  if (!onhand && !pending) {
    throw new Error("required attributes not defined"!);
  }

  var params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      id: account_id,
      sort_key: Profile.DEFAULT
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

export const getProfile = async ({
  account_id,
  item_type,
  deactivated
}: any) => {
  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "id = :id and begins_with(sort_key, :sort_key)",
    ExpressionAttributeValues: {
      ":id": account_id,
      ":sort_key": item_type ? `p@${item_type}` : "p@"
    }
  };

  if (Profile.DEFAULT.toString() === `p@${item_type}`) {
    params = Object.assign({}, params, {
      FilterExpression: "activated = :activated"
    });

    params.ExpressionAttributeValues = Object.assign(
      {},
      params.ExpressionAttributeValues,
      { ":activated": deactivated ? !deactivated : true }
    );
  }

  console.log(params);
  try {
    const { Count, ScannedCount, Items } = await dynamoDb
      .query(params)
      .promise();

    const items = Items.reduce(
      (accItem, currItem) => {
        if (!!currItem["sort_key"].match(/^p@D/)) {
          const { id, sort_key, ...rest } = currItem;
          accItem.default = { ...rest };
        } else if (!!currItem["sort_key"].match(/^p@P/)) {
          const { id, sort_key, ...rest } = currItem;
          accItem.plantations = [
            ...accItem.plantations,
            { ...rest, plantation_id: sort_key }
          ];
        }
        return accItem;
      },
      { default: null, plantations: [] }
    );

    return {
      count: Count,
      scannedCount: ScannedCount,
      account_id: account_id,
      items,
      result: "OK"
    };
  } catch (error) {
    return {
      result: new Error(error.message)
    };
  }
};

export const createPlantationProfile = async ({
  account_id,
  management,
  association,
  certificaton
}: any) => {
  const profile = `${Profile.PLANTATION}#${uuidv4()}`;
  console.log(management);
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      id: account_id,
      sort_key: profile,
      management,
      association,
      certificaton,
      createdAt: new Date().toISOString()
    }
  };

  try {
    const getProfilesResult = await getProfile({ account_id, type: "DEFAULT" });
    if (getProfilesResult.count === 0)
      throw new Error(
        "standard profile for this id does not exist or inactive!"
      );

    await dynamoDb.put(params).promise();
    return {
      account_id,
      plantation_id: profile,
      result: "OK"
    };
  } catch (error) {
    return {
      account_id,
      result: error
    };
  }
};
