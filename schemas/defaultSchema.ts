export const schema = [
  `
  enum ProfileItemEnum {
    DEFAULT
    PLANTATION
  } 

  type DefaultItems {
    updatedAt: String!
    createdAt : String!
    onhand: Int!
    pending: Int!
    origins : [Origin]
    activated: Boolean!
  }

  union ProfileItems = ProfileAllItems | ProfileDefaultItems | ProfilePlantationItems

  type ProfileAllItems {
    default : DefaultItems
    plantations : [PlantationItems]
  }

  type ProfileDefaultItems  {
    default : DefaultItems
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
  }

  extend type Query {
      getProfile(
        account_id: ID!
        item_type: ProfileItemEnum  
        ) : Profiles!
  }
`
];
