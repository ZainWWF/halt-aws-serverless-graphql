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