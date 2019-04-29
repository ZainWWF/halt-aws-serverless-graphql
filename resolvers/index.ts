import { getProfile } from "./getProfile";
import { createDefaultProfile } from "./createDefaultProfile";
import { setActivateStateDefaultProfile } from "./setActivateStateDefaultProfile";
import { updatePlantationProfile } from "./updatePlantationProfile";
import { createPlantationProfile } from "./createPlantationProfile";
import { updateDefaultProfile } from "./updateDefaultProfile";
import { ProfileItems } from "./typeProfileItems";
import { removePlantationProfile } from "./removePlantationProfile";

const typeResolvers = {
  ProfileItems
};

const queryResolvers = {
  getProfile
};

const mutationResolvers = {
  createDefaultProfile,
  updateDefaultProfile,
  setActivateStateDefaultProfile,
  createPlantationProfile,
  updatePlantationProfile,
  removePlantationProfile
};

export const resolvers = {
  ...typeResolvers,

  Query: {
    testMessage: (): string => {
      return "Hello World!";
    },
    ...queryResolvers
  },

  Mutation: {
    ...mutationResolvers
  }
};
