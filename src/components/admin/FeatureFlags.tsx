
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

interface Plan {
  id: string;
  name: string;
  can_edit_tasks: boolean;
}

export function FeatureFlags() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('plans')
        .select('id, name, can_edit_tasks')
        .order('name');

      if (error) {
        console.error('Error fetching plans:', error);
        toast.error('Could not load plans');
        return;
      }

      setPlans(data || []);
    } catch (error) {
      console.error('Error in fetchPlans:', error);
      toast.error('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  const updateFeatureFlag = async (planId: string, feature: keyof Omit<Plan, 'id' | 'name'>, value: boolean) => {
    try {
      setSaving(true);
      
      // Create a copy of the plans array
      const updatedPlans = [...plans];
      
      // Find the plan to update
      const planIndex = updatedPlans.findIndex(plan => plan.id === planId);
      if (planIndex === -1) return;
      
      // Update the feature flag locally first (optimistic update)
      updatedPlans[planIndex] = {
        ...updatedPlans[planIndex],
        [feature]: value
      };
      
      setPlans(updatedPlans);
      
      // Update in the database
      const { error } = await supabase
        .from('plans')
        .update({ [feature]: value })
        .eq('id', planId);
      
      if (error) {
        console.error('Error updating feature flag:', error);
        toast.error('Could not update feature flag');
        // Revert the optimistic update
        fetchPlans();
        return;
      }
      
      toast.success('Feature flag updated successfully');
    } catch (error) {
      console.error('Error updating feature flag:', error);
      toast.error('Failed to update feature flag');
      // Revert the optimistic update on error
      fetchPlans();
    } finally {
      setSaving(false);
    }
  };

  const resetFeatureFlagsForPlan = async (planId: string) => {
    // Find the plan name for the toast message
    const planName = plans.find(p => p.id === planId)?.name || 'Unknown';
    
    // Default values for a regular plan
    let defaultValues: any = {
      can_edit_tasks: false
    };
    
    // Special case for Pro plan - enable all features by default
    if (planName.toLowerCase() === 'pro') {
      defaultValues = {
        can_edit_tasks: true
      };
    }
    
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('plans')
        .update(defaultValues)
        .eq('id', planId);
      
      if (error) {
        console.error('Error resetting feature flags:', error);
        toast.error('Could not reset feature flags');
        return;
      }
      
      await fetchPlans();
      toast.success(`Reset ${planName} plan to default settings`);
    } catch (error) {
      console.error('Error resetting feature flags:', error);
      toast.error('Failed to reset feature flags');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <Settings className="h-5 w-5" />
          <CardTitle>Feature Flags</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-4">Loading plans...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-2">
        <Settings className="h-5 w-5" />
        <CardTitle>Feature Flags</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          Toggle which features are available for different plans.
        </p>
        
        {isMobile ? (
          <div className="space-y-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-medium flex items-center">
                    {plan.name === 'Pro' && <Sparkles className="h-4 w-4 text-violet-500 mr-1" />}
                    {plan.name} Plan
                  </h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => resetFeatureFlagsForPlan(plan.id)}
                    disabled={saving}
                  >
                    Reset
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Edit Tasks</span>
                    <Switch 
                      checked={plan.can_edit_tasks} 
                      onCheckedChange={(checked) => updateFeatureFlag(plan.id, 'can_edit_tasks', checked)}
                      disabled={saving}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Edit Tasks</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium flex items-center">
                      {plan.name === 'Pro' && <Sparkles className="h-4 w-4 text-violet-500 mr-1" />}
                      {plan.name}
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={plan.can_edit_tasks} 
                        onCheckedChange={(checked) => updateFeatureFlag(plan.id, 'can_edit_tasks', checked)}
                        disabled={saving}
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => resetFeatureFlagsForPlan(plan.id)}
                        disabled={saving}
                      >
                        Reset Defaults
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
