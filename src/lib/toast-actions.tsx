import { toast } from "sonner";

const DEFAULT_DURATION = 3000;

type Props = {
  message: string;
  duration?: number;
};

export const showError = ({ message, duration = DEFAULT_DURATION }: Props) => {
  toast.error(message, {
    style: {
      background: "red",
      color: "white",
    },
    duration,
  });
};

export const showSuccess = ({
  message,
  duration = DEFAULT_DURATION,
}: Props) => {
  toast.error(message, {
    style: {
      background: "green",
      color: "white",
    },
    duration,
  });
};
