"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { Controller, type FieldValues, type FormProviderProps, FormProvider, useFormContext } from "react-hook-form"
import { cn } from "@/lib/utils"

const Form = ({ ...props }: FormProviderProps<FieldValues>) => {
  return <FormProvider {...props} />
}

const FormField = Controller

const FormItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn("space-y-2", className)} {...props} />
})
FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label ref={ref} className={cn("text-sm font-medium", className)} {...props} />
))
FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef<
  React.ElementRef<typeof Slot>,
  React.ComponentPropsWithoutRef<typeof Slot>
>(({ ...props }, ref) => <Slot ref={ref} {...props} />)
FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn("text-xs text-muted-foreground", className)} {...props} />
))
FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => {
  const { formState } = useFormContext()
  const error = (props as any).name ? (formState.errors as any)[(props as any).name] : undefined
  const message = (error && (error.message as string)) || (props.children as any)
  if (!message) return null
  return (
    <p ref={ref} className={cn("text-sm font-medium text-red-500", className)} {...props}>
      {message}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

export { Form, FormItem, FormLabel, FormControl, FormDescription, FormMessage, FormField }
