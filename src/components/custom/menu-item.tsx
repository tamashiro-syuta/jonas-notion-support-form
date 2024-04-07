import { showError } from "@/lib/toast-actions";
import { Button } from "../ui/button";
import Link from "next/link";

interface MenuItemProps {
  selectedNotionDBId: string | undefined;
  targetFeatureName: string;
  targetFeaturePath: string;
  isSettings?: boolean;
}

const MenuItem = ({
  selectedNotionDBId,
  targetFeatureName,
  targetFeaturePath,
  isSettings = false,
}: MenuItemProps) => {
  if (!selectedNotionDBId) {
    return (
      <Button
        variant="outline"
        className="w-full text-base my-2 h-16 hover:bg-gray-100 border-2 border-primary"
        onClick={() => showError({ message: "家計簿を選択してください" })}
      >
        {targetFeatureName} へ
      </Button>
    );
  }

  const href = isSettings
    ? `/settings/${selectedNotionDBId}/${targetFeaturePath}`
    : `/${selectedNotionDBId}/${targetFeaturePath}`;

  return (
    <Button
      asChild
      variant="link"
      className="w-full text-base my-2 h-16 hover:bg-gray-100 border-2 border-primary"
    >
      <Link href={href}>{targetFeatureName} へ</Link>
    </Button>
  );
};

export default MenuItem;
