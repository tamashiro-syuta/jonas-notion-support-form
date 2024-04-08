import { showError } from "@/lib/toast-actions";
import { Button } from "../ui/button";
import Link from "next/link";

interface MenuItemProps {
  householdType: string | undefined;
  targetFeatureName: string;
  targetFeaturePath: string;
  isSettings?: boolean;
}

const MenuItem = ({
  householdType,
  targetFeatureName,
  targetFeaturePath,
  isSettings = false,
}: MenuItemProps) => {
  if (!householdType) {
    return (
      <Button
        variant="secondary"
        className="w-full text-base my-2 h-16 shadow-md hover:bg-stone-200"
        onClick={() => showError({ message: "家計簿を選択してください" })}
      >
        {targetFeatureName}
      </Button>
    );
  }

  const href = isSettings
    ? `/${householdType}/${targetFeaturePath}/settings`
    : `/${householdType}/${targetFeaturePath}`;

  return (
    <Button
      asChild
      variant="secondary"
      className="w-full text-base my-2 h-16 shadow-md hover:bg-stone-200"
    >
      <Link href={href}>{targetFeatureName}</Link>
    </Button>
  );
};

export default MenuItem;
