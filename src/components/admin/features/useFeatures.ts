
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useFeatures() {
  return useQuery({
    queryKey: ["features"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("features")
        .select("*")
        .order("name");

      if (error) {
        throw error;
      }

      return data;
    }
  });
}
