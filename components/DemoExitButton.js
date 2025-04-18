"use client";

import { useRouter } from "next/navigation";
import { useDemoMode } from "@/contexts/DemoContext";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";

export default function DemoExitButton() {
  const router = useRouter();
  const { isDemoMode, deactivateDemoMode } = useDemoMode();

  // If not in demo mode, don't render anything
  if (!isDemoMode) {
    return null;
  }

  // Handle exit demo mode
  const handleExitDemo = () => {
    // Deactivate demo mode
    deactivateDemoMode();
    // Redirect to login page
    router.push("/");
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        onClick={handleExitDemo}
        variant="outline"
        size="sm"
        className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 shadow-sm rounded-full"
      >
        <Info className="h-4 w-4" />
        <span>Quitter le mode démo</span>
      </Button>
    </div>
  );
}
