export const schema = [
`
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
  
  type PlantationItems {
    type: String!
    plantation_id: ID!
    createdAt: String!
    management: PlantationManagement!
    association: PlantationBuyerAssociation! 
    certificaton: PlantationCertificationEnum!
    transferCount: Int!
  }

  type ProfilePlantationItems {
    plantations : [PlantationItems]
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

  type removePlantationProfileResult {
    plantation_id: ID
    result: String!
  }

  extend type Mutation {    
    createPlantationProfile( 
      account_id: ID!
      management : PlantationManagementInput!
      association: PlantationBuyerAssociationInput! 
      certificaton: PlantationCertificationEnum!
    ) : createPlantationProfileResult!
  
    updatePlantationProfile (
      account_id: ID!
      plantation_id: ID!
      management : PlantationManagementInput!
      association: PlantationBuyerAssociationInput!
      certificaton: PlantationCertificationEnum!
    ) : updatePlantationProfileResult!

    removePlantationProfile(
      account_id: ID!
      plantation_id: ID!
    ) : removePlantationProfileResult!
  }
`
];