
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TaskStatsCard } from "./TaskStatsCard";

export function ProUpgradeCard() {
  return (
    <TaskStatsCard
      title="Task Analytics"
      description="Upgrade to Pro to access detailed task statistics and analytics"
    >
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <div className="mb-6 rounded-full bg-milk-100 p-3">
          <Lock className="h-8 w-8 text-milk-500" />
        </div>
        <h3 className="mb-2 text-xl font-medium">Pro Feature</h3>
        <p className="mb-6 text-milk-500">
          Analytics help you track your productivity and task completion patterns over time.
          Upgrade to Pro to unlock this feature.
        </p>
        <Link to="/pricing">
          <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">
            Upgrade to Pro
          </Button>
        </Link>
      </div>
    </TaskStatsCard>
  );
}
