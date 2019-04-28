import {
  createDefaultProfile,
  createPlantationProfile,
  getProfile,
  setActivateStateDefaultProfile,
  updateDefaultProfile
} from "../resolvers/dynamo-db";

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
  plasma: String
  mill: String
  agreement: String
}


type PlantationBuyerAssociation{
  type: PlantationBuyerAssociationEnum! 
  plasma: String
  mill: String
  agreement: String
}


input PlantationManagementInput {
  type: PlantationManagementEnum!
  concession_company: String
  other_details: String

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
  plantation_id: ID!
  createdAt : String!
  management : PlantationManagement!
  association: PlantationBuyerAssociation! 
  certificaton: PlantationCertificationEnum!
}

type ProfileItems {
  default : DefaultItems
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
}

extend type Query {
    getProfile(
      account_id: ID!
      item_type: ProfileItemEnum
      deleted : Boolean
      deactivated: Boolean    
      ) : Profiles!
}

`
];

export const typeResolvers = {};
export const queryResolvers = {
  getProfile: async (_, { account_id, item_type, deactivated }) => {
    return getProfile({ account_id, item_type, deactivated });
  }
};
export const mutationResolvers = {
  createDefaultProfile: async (_, { account_id }) => {
    return createDefaultProfile({ account_id });
  },

  updateDefaultProfile: async (_, { account_id, onhand, pending, origins }) => {
    return updateDefaultProfile({ account_id, onhand, pending, origins });
  },

  setActivateStateDefaultProfile: async (_, { account_id, activate }) => {
    return setActivateStateDefaultProfile({ account_id, activate });
  },
  createPlantationProfile: async (
    _,
    { account_id, management, association, certificaton }
  ) => {
    return createPlantationProfile({
      account_id,
      management,
      association,
      certificaton
    });
  }
};
