import {
  createDefaultProfile,
  createPlantationProfile,
  getProfile,
  setActivateStateDefaultProfile,
  updateDefaultProfile,
  updatePlantationProfile
} from "../resolvers/dynamo-db";
import Profile from "../types/profile";

export const schema = [
  `
enum ProfileItemEnum {
  DEFAULT
  PLANTATION
} 

enum PlantationManagementEnum {
  PRIVATE
  FARMER_GROUP
  COOPERATIVE
  CONCESSION_COMPANY
  OTHER
}

enum PlantationBuyerAssociationEnum {
  PLASMA_WITH_LEGAL_DOCUMENT
  PLASMA_WITH_AGREEMENT
  THIRD_PARTY_WITH_AGREEMENT
  NO_AGREEMENT
}

enum PlantationCertificationEnum{
  ISPO
  RSPO
  NOT_CERTIFIED
}


input PlantationBuyerAssociationInput{
  type: PlantationBuyerAssociationEnum! 
  plasma: String!
  mill: String!
  agreement: String!
}


type PlantationBuyerAssociation{
  type: PlantationBuyerAssociationEnum! 
  plasma: String
  mill: String
  agreement: String
}


input PlantationManagementInput {
  type: PlantationManagementEnum!
  concession_company: String!
  other_details: String!

}

type PlantationManagement {
  type: PlantationManagementEnum!
  concession_company: String
  other_details: String

}

input OriginInput {
  plantation_id: ID!
  percent : Float!
}

type Origin {
  plantation_id: ID!
  percent : Float!
}

type DefaultItems {
  updatedAt: String!
  createdAt : String!
  onhand: Int!
  pending: Int!
  origins : [Origin]
  activated: Boolean!
}

type  PlantationItems {
  type: String!
  plantation_id: ID!
  createdAt : String!
  management : PlantationManagement!
  association: PlantationBuyerAssociation! 
  certificaton: PlantationCertificationEnum!
}

union ProfileItems = ProfileAllItems | ProfileDefaultItems | ProfilePlantationItems

type ProfileAllItems {
  default : DefaultItems
  plantations : [PlantationItems]
}

type ProfileDefaultItems  {
  default : DefaultItems
}

type ProfilePlantationItems {
  plantations : [PlantationItems]
}

type Profiles {
  account_id: ID!
  result: String!
  count : Int
  scannedCount: Int
  items : ProfileItems
}

type createDefaultProfileResult {
  account_id: ID!
  result : String!
}

type setActivateStateDefaultProfileResult {
  account_id: ID!
  result : String!
}

type updateDefaultProfileResult {
  account_id: ID!
  result : String!
}

type createPlantationProfileResult {
  account_id: ID!
  plantation_id: ID
  result: String!
}

type updatePlantationProfileResult {
  plantation_id: ID
  result: String!
}

extend type Mutation {
  createDefaultProfile( 
    account_id: ID!
  ) : createDefaultProfileResult!

  setActivateStateDefaultProfile( 
    account_id: ID!
    activate : Boolean!
  ) : setActivateStateDefaultProfileResult! 

  updateDefaultProfile( 
    account_id: ID!
    onhand : Int 
    pending : Int
    origins : [OriginInput]
  ) : updateDefaultProfileResult!
  
  createPlantationProfile( 
    account_id: ID!
    management : PlantationManagementInput!
    association: PlantationBuyerAssociationInput! 
    certificaton: PlantationCertificationEnum!
  ) : createPlantationProfileResult!

  updatePlantationProfile( 
    account_id: ID!
    plantation_id: ID!
    management : PlantationManagementInput!
    association: PlantationBuyerAssociationInput!
    certificaton: PlantationCertificationEnum!
  ) : updatePlantationProfileResult!
}

extend type Query {
    getProfile(
      account_id: ID!
      item_type: ProfileItemEnum  
      ) : Profiles!
}

`
];

export const typeResolvers = {
  ProfileItems: {
    __resolveType(_, context) {
      const item_type = JSON.parse(context.event.body)["query"].match(
        /item_type: (.*)\)/
      );

      if (!item_type) {
        return "ProfileAllItems";
      } else if (item_type[1] === Profile.DEFAULT) {
        return "ProfileDefaultItems";
      } else if (item_type[1] === Profile.PLANTATION) {
        return "ProfilePlantationItems";
      }
    }
  }
};

export const queryResolvers = {
  getProfile: async (_, { account_id, item_type }, { dynamoDb }) => {
    return getProfile(account_id, item_type, dynamoDb);
  }
};
export const mutationResolvers = {
  createDefaultProfile: async (_, { account_id }, { dynamoDb }) => {
    return createDefaultProfile(account_id, dynamoDb);
  },

  updateDefaultProfile: async (
    _,
    { account_id, onhand, pending, origins },
    { dynamoDb }
  ) => {
    return updateDefaultProfile(account_id, onhand, pending, origins, dynamoDb);
  },

  setActivateStateDefaultProfile: async (
    _,
    { account_id, activate },
    { dynamoDb }
  ) => {
    return setActivateStateDefaultProfile(account_id, activate, dynamoDb);
  },
  createPlantationProfile: async (
    _,
    { account_id, management, association, certificaton },
    { dynamoDb }
  ) => {
    return createPlantationProfile(
      account_id,
      management,
      association,
      certificaton,
      dynamoDb
    );
  },

  updatePlantationProfile: async (
    _,
    { account_id, plantation_id, management, association, certificaton },
    { dynamoDb }
  ) => {
    return updatePlantationProfile(
      account_id,
      plantation_id,
      management,
      association,
      certificaton,
      dynamoDb
    );
  }
};
