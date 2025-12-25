import * as React from "react"
import {
  useForm,
  UseFormReturn,
  FieldValues,
  Path,
  Controller,
  ControllerRenderProps,
  FieldPath,
} from "react-hook-form"
import { cn } from "@/lib/utils"

interface FormContextValue<T extends FieldValues> {
  form: UseFormReturn<T>
}

const FormContext = React.createContext<FormContextValue<any> | null>(null)

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  children: React.ReactNode
  className?: string
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void
}

export function Form<T extends FieldValues>({
  form,
  children,
  className,
  onSubmit,
  ...props
}: FormProps<T>) {
  return (
    <FormContext.Provider value={{ form }}>
      <form 
        className={className} 
        onSubmit={onSubmit || form.handleSubmit(() => {})} 
        {...props}
      >
        {children}
      </form>
    </FormContext.Provider>
  )
}

function useFormContext<T extends FieldValues>() {
  const context = React.useContext(FormContext)
  if (!context) {
    throw new Error("Form components must be used within a Form")
  }
  return context.form as UseFormReturn<T>
}

interface FormFieldProps<T extends FieldValues> {
  control: UseFormReturn<T>["control"]
  name: Path<T>
  render: (props: {
    field: ControllerRenderProps<T, Path<T>>
    fieldState: {
      error?: { message?: string }
    }
  }) => React.ReactNode
}

export function FormField<T extends FieldValues>({
  control,
  name,
  render,
}: FormFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={(props) => {
        const result = render({ 
          field: props.field,
          fieldState: {
            error: props.fieldState.error,
          }
        })
        return result as React.ReactElement
      }}
    />
  )
}

interface FormItemProps extends React.HTMLAttributes<HTMLDivElement> {}

export const FormItem = React.forwardRef<HTMLDivElement, FormItemProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props} />
    )
  }
)
FormItem.displayName = "FormItem"

interface FormLabelProps
  extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const FormLabel = React.forwardRef<HTMLLabelElement, FormLabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
          className
        )}
        {...props}
      />
    )
  }
)
FormLabel.displayName = "FormLabel"

interface FormControlProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const FormControl = React.forwardRef<HTMLDivElement, FormControlProps>(
  ({ ...props }, ref) => {
    return <div ref={ref} {...props} />
  }
)
FormControl.displayName = "FormControl"

interface FormMessageProps extends React.HTMLAttributes<HTMLParagraphElement> {
  children?: React.ReactNode
}

export const FormMessage = React.forwardRef<
  HTMLParagraphElement,
  FormMessageProps
>(({ className, children, ...props }, ref) => {
  const form = useFormContext()
  const error = form.formState.errors[props.id as string]
  if (!error) return null

  return (
    <p
      ref={ref}
      className={cn("text-sm font-medium text-destructive", className)}
      {...props}
    >
      {error.message as string}
    </p>
  )
})
FormMessage.displayName = "FormMessage"

