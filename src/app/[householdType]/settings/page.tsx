import { GearIcon } from "@radix-ui/react-icons";
import MenuItem from "@/components/custom/menu-item";
import { matchHouseholdType } from "@/lib/db/matchHouseholdType";
import { redirect } from "next/navigation";
import { showError } from "@/lib/toast-actions";

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
          <h1 className="pl-1 text-xl text-left py-1">設定</h1>
        </div>
        <MenuItem
          householdType={householdType}
          targetFeatureName="支出の追加"
          targetFeaturePath="addSpending"
          isSettings
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName="項目別の予算"
          targetFeaturePath="balanceByGenre"
          isSettings
        />

        <MenuItem
          householdType={householdType}
          targetFeatureName="今月の残額"
          targetFeaturePath="budgetByGenre"
          isSettings
        />
      </div>
    </div>
  );
};

export default Page;
