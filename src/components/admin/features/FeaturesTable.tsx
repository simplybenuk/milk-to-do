
import { useState } from 'react';
import { Table, TableHeader, TableHead, TableRow, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Edit, Plus } from "lucide-react";
import { useFeatures } from "./useFeatures";
import { FeatureDialog } from "./FeatureDialog";

interface Feature {
  id: string;
  name: string;
  description: string | null;
  availability: ("free" | "pro" | "beta")[];
  updated_at: string;
}

export function FeaturesTable() {
  const { data, isLoading } = useFeatures();
  const [selectedFeature, setSelectedFeature] = useState<Feature | undefined>();
  const [showDialog, setShowDialog] = useState(false);
  
  if (isLoading) {
    return <div>Loading features...</div>;
  }

  const handleEdit = (feature: Feature) => {
    setSelectedFeature(feature);
    setShowDialog(true);
  };

  const handleAdd = () => {
    setSelectedFeature(undefined);
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
    setSelectedFeature(undefined);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Features</h2>
        <Button onClick={handleAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Feature
        </Button>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Availability</TableHead>
            <TableHead>Last Updated</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((feature) => (
            <TableRow key={feature.id}>
              <TableCell className="font-medium">{feature.name}</TableCell>
              <TableCell>{feature.description}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  {feature.availability.map((level) => (
                    <Badge
                      key={level}
                      variant={level === 'beta' ? 'destructive' : level === 'pro' ? 'default' : 'secondary'}
                    >
                      {level}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell>{new Date(feature.updated_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <Button variant="ghost" size="icon" onClick={() => handleEdit(feature)}>
                  <Edit className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <FeatureDialog 
        open={showDialog}
        onClose={handleCloseDialog}
        initialData={selectedFeature}
      />
    </div>
  );
}
