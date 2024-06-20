import { LucideIcon } from "lucide-react";

import { IconBadge } from "@/components/icon-badge"

interface InfoCardProps {
  numberOfItems: number;
  variant?: "default" | "success";
  label: string;
  icon: LucideIcon;
}

export const InfoCard = ({
  variant,
  icon: Icon,
  numberOfItems,
  label,
}: InfoCardProps) => {
  return (
    <div dir="rtl" className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge
        variant={variant}
        icon={Icon}
      />
      <div>
        <div className="font-medium">
          {label}
        </div>
        <div className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "دورات" : "دورات"}
        </div>
      </div>
    </div>
  )
}