import { cn } from "../../lib/utils"

export const Alert = ({ className, ...props }) => (
  <div
    role='alert'
    className={cn(
      "relative w-full rounded-lg border px-4 py-3 text-sm bg-white",
      className
    )}
    {...props}
  />
)

export const AlertDescription = ({ className, ...props }) => (
  <div className={cn("text-sm [&_p]:leading-relaxed", className)} {...props} />
)
