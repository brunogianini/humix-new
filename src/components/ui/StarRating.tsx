"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizes = { sm: "w-3 h-3", md: "w-5 h-5", lg: "w-7 h-7" };

export function StarRating({ value, onChange, readonly = false, size = "md" }: StarRatingProps) {
  const [hovered, setHovered] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const active = readonly ? value : hovered || value;

  return (
    <div className="flex gap-0.5">
      {stars.map((star) => {
        const full = active >= star;
        const half = !full && active >= star - 0.5;
        return (
          <button
            key={star}
            type="button"
            disabled={readonly}
            className={cn(
              "relative transition-transform",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
            onClick={() => {
              if (!readonly && onChange) {
                const halfPoint = star - 0.5;
                onChange(hovered === halfPoint ? halfPoint : star);
              }
            }}
            onMouseMove={(e) => {
              if (readonly) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              setHovered(x < rect.width / 2 ? star - 0.5 : star);
            }}
            onMouseLeave={() => !readonly && setHovered(0)}
          >
            <svg
              viewBox="0 0 24 24"
              className={cn(sizes[size], "transition-colors")}
              fill={full ? "#7c6af7" : "none"}
              stroke={full || half ? "#7c6af7" : "#3a3a50"}
              strokeWidth="1.5"
            >
              <defs>
                {half && (
                  <linearGradient id={`half-${star}`} x1="0" x2="1" y1="0" y2="0">
                    <stop offset="50%" stopColor="#7c6af7" />
                    <stop offset="50%" stopColor="transparent" />
                  </linearGradient>
                )}
              </defs>
              <polygon
                points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
                fill={half ? `url(#half-${star})` : full ? "#7c6af7" : "none"}
              />
            </svg>
          </button>
        );
      })}
    </div>
  );
}
