import  * as aws from 'aws-sdk';
const cognitoidentityserviceprovider = new aws.CognitoIdentityServiceProvider();

exports.preSignUpHandler = (event, _, callback) => {
  if (!event.request.userAttributes.hasOwnProperty('phone_number')) {
    callback(new Error('phone number is required'), event);
  }

  const params = {
    UserPoolId: process.env.USER_POOL_ID,
    AttributesToGet: ['phone_number'],
    Filter: 'phone_number = "' + event.request.userAttributes.phone_number + '"'
  };
  cognitoidentityserviceprovider.listUsers(params, function(err, data) {
    if (!err) {
      if (data.hasOwnProperty('Users')) {
        if (data.Users.length == 0) {
          callback(null, event);
        }
        callback(new Error('mobile number already registered'), event);
      }
    }
    callback(err, event);
  });
};
