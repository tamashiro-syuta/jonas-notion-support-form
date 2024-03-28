import SideBar from "@/components/custom/sidebar";
import {
  CheckIcon,
  ChevronRightIcon,
  DotFilledIcon,
} from "@radix-ui/react-icons";

interface Props {
  children: React.ReactNode;
}

const Layout = ({ children }: Props) => {
  const lists = [
    {
      href: "/settings/balanceByCategory",
      icon: <ChevronRightIcon className="w-full h-full" />,
      text: "カテゴリ別の予算",
    },
    {
      href: "/settings/totalBalance",
      icon: <CheckIcon className="w-full h-full" />,
      text: "今月の残額",
    },
  ];

  return (
    <div>
      <SideBar lists={lists}>{children}</SideBar>
    </div>
  );
};

export default Layout;
