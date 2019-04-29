export const getProfile = async (_, { account_id, item_type }, { dynamoDb }) => {
  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    KeyConditionExpression: "id = :id and begins_with(sort_key, :sort_key)",
    ExpressionAttributeValues: {
      ":id": account_id,
      ":sort_key": item_type ? `p@${item_type}` : "p@"
    }
  };

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
