
import { SheetContent as SheetPrimitiveContent, SheetClose } from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import * as React from "react";
import { cn } from "@/lib/utils";
import { sheetVariants } from "./styles";
import type { VariantProps } from "class-variance-authority";

interface SheetContentProps
  extends React.ComponentPropsWithoutRef<typeof SheetPrimitiveContent>,
  VariantProps<typeof sheetVariants> { }

const SheetContent = React.forwardRef<
  React.ElementRef<typeof SheetPrimitiveContent>,
  SheetContentProps
>(({ side = "right", className, children, ...props }, ref) => (
  <>
    <SheetPrimitiveContent
      ref={ref}
      className={cn(sheetVariants({ side }), className)}
      {...props}
    >
      {children}
      <SheetClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </SheetClose>
    </SheetPrimitiveContent>
  </>
));

SheetContent.displayName = SheetPrimitiveContent.displayName;

export { SheetContent };
