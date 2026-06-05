import { LoaderCircle } from "lucide-react";

export default function Spinner({ size = "md", className = "" }) {
  const sizes = { sm: "size-4", md: "size-5", lg: "size-8" };
  return <LoaderCircle className={`${sizes[size]} animate-spin text-indigo-500 ${className}`} />;
}
