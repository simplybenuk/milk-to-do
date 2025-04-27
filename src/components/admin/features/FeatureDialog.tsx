
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

interface FeatureFormData {
  name: string;
  description: string | null;
  availability: ("free" | "pro" | "beta")[];
}

interface FeatureDialogProps {
  open: boolean;
  onClose: () => void;
  initialData?: {
    id: string;
    name: string;
    description: string | null;
    availability: ("free" | "pro" | "beta")[];
  };
}

export function FeatureDialog({ open, onClose, initialData }: FeatureDialogProps) {
  const [availabilityOptions] = useState<("free" | "pro" | "beta")[]>(["free", "pro", "beta"]);
  const queryClient = useQueryClient();
  
  // Move useForm inside a conditional to ensure it's only used when the component is actually rendered
  // This prevents the "Cannot read properties of null (reading 'useRef')" error
  if (!open) {
    return null;
  }
  
  const form = useForm<FeatureFormData>({
    defaultValues: initialData || {
      name: '',
      description: '',
      availability: ['free']
    }
  });

  const toggleAvailability = (value: "free" | "pro" | "beta") => {
    const current = form.getValues().availability;
    if (current.includes(value)) {
      form.setValue('availability', current.filter(v => v !== value));
    } else {
      form.setValue('availability', [...current, value]);
    }
  };

  const onSubmit = async (data: FeatureFormData) => {
    try {
      if (initialData) {
        // Update existing feature
        const { error } = await supabase
          .from('features')
          .update({
            name: data.name,
            description: data.description,
            availability: data.availability
          })
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('Feature updated successfully');
      } else {
        // Create new feature
        const { error } = await supabase
          .from('features')
          .insert([{
            name: data.name,
            description: data.description,
            availability: data.availability
          }]);

        if (error) throw error;
        toast.success('Feature created successfully');
      }

      queryClient.invalidateQueries({ queryKey: ['features'] });
      onClose();
    } catch (error) {
      console.error('Error saving feature:', error);
      toast.error('Failed to save feature');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData ? 'Edit Feature' : 'Add New Feature'}</DialogTitle>
          <DialogDescription>
            {initialData ? 'Update feature details and availability.' : 'Create a new feature and set its availability.'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter feature name" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter feature description" />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="availability"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Availability</FormLabel>
                  <div className="flex gap-2">
                    {availabilityOptions.map((option) => (
                      <Badge
                        key={option}
                        variant={field.value.includes(option) ? 'default' : 'outline'}
                        className="cursor-pointer"
                        onClick={() => toggleAvailability(option)}
                      >
                        {option}
                      </Badge>
                    ))}
                  </div>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {initialData ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
