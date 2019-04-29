import Profile from "../types/profile";
import { getProfile } from "./getProfile";
import { createDefaultProfile } from "./createDefaultProfile";
import { setActivateStateDefaultProfile } from "./setActivateStateDefaultProfile";
import { updatePlantationProfile } from "./updatePlantationProfile";
import { createPlantationProfile } from "./createPlantationProfile";
import { updateDefaultProfile } from "./updateProfile";

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
  