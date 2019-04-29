import * as uuidv4 from "uuid/v4";
import Profile from "../types/profile";
// import { getProfile } from "./getProfile";
export const createPlantationProfile = async (
  _,
  { account_id, management, association, certificaton },
  { dynamoDb }
) => {
  const profile = `p@${Profile.PLANTATION}#${uuidv4()}`;
  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: {
      type: `#${certificaton}|${management.type}|${association.type}`,
      id: account_id,
      sort_key: profile,
      management,
      association,
      certificaton,
      createdAt: new Date().toISOString()
    }
  };

  try {
    //   const getProfilesResult = await getProfile(account_id, Profile.DEFAULT,  dynamoDb);
    //   if (getProfilesResult.count === 0)
    //     throw new Error(
    //       "standard profile for this id does not exist or inactive!"
    //     );

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
