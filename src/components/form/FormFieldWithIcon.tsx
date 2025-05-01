
import React from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface FormFieldWithIconProps {
  name: string;
  label: string;
  placeholder: string;
  type?: string;
  control: any;
  icon: LucideIcon;
}

export const FormFieldWithIcon = ({
  name,
  label,
  placeholder,
  type = "text",
  control,
  icon: Icon,
}: FormFieldWithIconProps) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <div className="relative">
              <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type={type} 
                placeholder={placeholder} 
                className="pl-10 bg-white/5" 
                {...field} 
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
