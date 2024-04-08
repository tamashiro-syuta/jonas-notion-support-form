import { HouseholdType } from "@prisma/client";

export const matchHouseholdType = (value: string): boolean => {
  if (value === HouseholdType.INDIVIDUAL) return true;
  if (value === HouseholdType.PAIRS) return true;

  return false;
};

export const castHouseholdType = (value: string): HouseholdType => {
  if (value === HouseholdType.INDIVIDUAL) return HouseholdType.INDIVIDUAL;
  if (value === HouseholdType.PAIRS) return HouseholdType.PAIRS;

  throw new Error("invalid household type");
};
