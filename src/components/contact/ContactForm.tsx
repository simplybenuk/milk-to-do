
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

type FormData = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export const ContactForm = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // Call the Supabase Edge Function to send the email
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: formData
      });

      if (error) {
        throw error;
      }
      
      // Show success message
      toast({
        title: "Message sent!",
        description: "Thank you for reaching out. We'll get back to you soon.",
      });
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Send us a Message</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name" 
            value={formData.name}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="subject">Subject</Label>
          <Input 
            id="subject" 
            name="subject" 
            value={formData.subject}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <div>
          <Label htmlFor="message">Message</Label>
          <Textarea 
            id="message" 
            name="message" 
            rows={5}
            value={formData.message}
            onChange={handleInputChange}
            required
            disabled={isSubmitting}
          />
        </div>
        <Button 
          type="submit" 
          className="bg-emerald-500 hover:bg-emerald-600 w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </div>
  );
};
