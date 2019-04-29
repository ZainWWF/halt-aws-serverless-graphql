import Profile from "../types/profile";

export const ProfileItems = {
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