export const updatePlantationProfile = async (
  _,
  { account_id, plantation_id, management, association, certificaton },
  { dynamoDb }
) => {
  if (!management && !association && !certificaton) {
    throw new Error("required attributes not defined"!);
  }

  var params = {
    TableName: process.env.DYNAMODB_TABLE,
    IndexName: process.env.GS1,
    Key: {
      id: account_id,
      sort_key: plantation_id
    },
    UpdateExpression: "SET updatedAt = :updatedAt, #type = :type,",
    ExpressionAttributeNames: {
      "#type": "type"
    },
    ExpressionAttributeValues: {
      ":updatedAt": new Date().toISOString(),
      ":type": `#${certificaton}|${management.type}|${association.type}`
    }
  };

  if (management) {
    params.UpdateExpression = `${
      params.UpdateExpression
    } management = :management`;
    params.ExpressionAttributeValues = Object.assign(
      {},
      params.ExpressionAttributeValues,
      { ":management": { ...management } }
    );
    if (association) {
      params.UpdateExpression = `${params.UpdateExpression},`;
    }
  }

  if (association) {
    params.UpdateExpression = `${
      params.UpdateExpression
    } association = :association`;
    params.ExpressionAttributeValues = Object.assign(
      {},
      params.ExpressionAttributeValues,
      { ":association": association }
    );
    if (certificaton) {
      params.UpdateExpression = `${params.UpdateExpression},`;
    }
  }

  if (certificaton) {
    params.UpdateExpression = `${
      params.UpdateExpression
    } certificaton = :certificaton`;
    params.ExpressionAttributeValues = Object.assign(
      {},
      params.ExpressionAttributeValues,
      { ":certificaton": certificaton }
    );
  }

  try {
    await dynamoDb.update(params).promise();
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
