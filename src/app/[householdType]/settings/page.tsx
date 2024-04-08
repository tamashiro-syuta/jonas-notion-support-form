import { GearIcon } from "@radix-ui/react-icons";
import MenuItem from "@/components/custom/menu-item";
import { matchHouseholdType } from "@/lib/db/matchHouseholdType";
import { redirect } from "next/navigation";
import { showError } from "@/lib/toast-actions";
import {
  ADD_SPENDING,
  BALANCE_BY_GENRE,
  BUDGET_BY_GENRE,
  SETTINGS,
} from "@/lib/constants";

interface Props {
  params: {
    householdType: string;
  };
}

const Page = ({ params: { householdType } }: Props) => {
  if (!matchHouseholdType(householdType)) {
    showError({ message: "不適切な値が指定されています" });
    redirect("/");
  }

  return (
    <div>
      <div>
        <div className="flex items-center">
          <GearIcon className="h-6 w-6" />
          <h1 className="pl-1 text-xl text-left py-1">{SETTINGS}</h1>
        </div>
        <MenuItem
          householdType={householdType}
          targetFeatureName={ADD_SPENDING}
          targetFeaturePath="addSpending"
          isSettings
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName={BUDGET_BY_GENRE}
          targetFeaturePath="budgetByGenre"
          isSettings
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName={BALANCE_BY_GENRE}
          targetFeaturePath="balanceByGenre"
          isSettings
        />
      </div>
    </div>
  );
};

export default Page;
