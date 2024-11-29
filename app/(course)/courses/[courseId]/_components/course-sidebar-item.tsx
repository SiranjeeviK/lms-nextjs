"use client";

import { cn } from "@/lib/utils";
import { CheckCircle, LockIcon, PlayCircle } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface CourseSidebarItemProps {
  label: string;
  id: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}

const CourseSidebarItem = ({
  label,
  id,
  isCompleted,
  courseId,
  isLocked,
}: CourseSidebarItemProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = isLocked ? LockIcon : isCompleted ? CheckCircle : PlayCircle;

  const isActive = pathname.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapters/${id}`);
  };

  return (
    <button
      type="button"
      className={cn(
        "flex items-center gap-x-2 pl-6 text-sm font-[500] text-slate-500 transition-all hover:bg-slate-300/20 hover:text-slate-600",

        isActive &&
          "bg-slate-200/20 text-slate-700 hover:bg-slate-200/20 hover:text-slate-700",

        isCompleted && "text-emerald-700 hover:text-emerald-700",

        isActive && isCompleted && "bg-emerald-200/20",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size={22}
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
            isCompleted && "text-emerald-700",
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto h-full border-2 border-slate-700 opacity-0 transition-all",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700",
        )}
      ></div>
    </button>
  );
};

export default CourseSidebarItem;
