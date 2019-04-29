import * as uuidv4 from "uuid/v4";
import Profile from "../types/profile";
export const createPlantationProfile = async (
  _,
  { account_id, management, association, certificaton },
  { dynamoDb }
) => {
  const profile = `p@${Profile.PLANTATION}#${uuidv4()}`;
  const putParams = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      type: `#${certificaton}|${management.type}|${association.type}`,
      id: account_id,
      sort_key: profile,
      management,
      association,
      certificaton,
      transferCount : 0,
      createdAt: new Date().toISOString()
    }
  };

  const queryParams = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "id = :id and begins_with(sort_key, :sort_key)",
    FilterExpression: "activated = :activated",
    ExpressionAttributeValues: {
      ":id": account_id,
      ":sort_key": `p@${Profile.DEFAULT}`,
      ":activated": true
    }
  };

  try {
    const { Count } = await dynamoDb.query(queryParams).promise();
    if (Count === 0)
      throw new Error(
        "standard profile for this id does not exist or inactive!"
      );

    await dynamoDb.put(putParams).promise();
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
