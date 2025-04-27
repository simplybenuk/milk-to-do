
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FeaturesTable } from "./features/FeaturesTable";
import { Settings } from "lucide-react";

export function AdminFeatures() {
  return (
    <Card className="min-w-[300px]">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Feature Management</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <FeaturesTable />
      </CardContent>
    </Card>
  );
}
