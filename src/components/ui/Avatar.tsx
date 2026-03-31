import Image from "next/image";
import { cn, getInitials } from "@/lib/utils";

interface AvatarProps {
  src?: string | null;
  name: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  xs: "w-6 h-6 text-[10px]",
  sm: "w-8 h-8 text-xs",
  md: "w-10 h-10 text-sm",
  lg: "w-14 h-14 text-base",
  xl: "w-20 h-20 text-xl",
};

const pxSizes = { xs: 24, sm: 32, md: 40, lg: 56, xl: 80 };

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  if (src) {
    return (
      <div className={cn("relative rounded-full overflow-hidden shrink-0", sizes[size], className)}>
        <Image
          src={src}
          alt={name}
          width={pxSizes[size]}
          height={pxSizes[size]}
          className="object-cover w-full h-full"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-full shrink-0 flex items-center justify-center font-semibold",
        "bg-gradient-to-br from-accent to-accent-hover text-white",
        sizes[size],
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}
