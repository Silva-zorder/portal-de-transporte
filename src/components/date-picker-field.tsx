import { Button } from "@hubble-ds/components/ui/button";
import { Calendar } from "@hubble-ds/components/ui/calendar";
import { Field, FieldLabel } from "@hubble-ds/components/ui/field";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@hubble-ds/components/ui/popover";
import { CalendarBlankIcon } from "@phosphor-icons/react";
import { ptBR } from "date-fns/locale";
import { type ComponentProps, useState } from "react";

function DatePickerField({
  id,
  label,
  value,
  onValueChange,
  "data-testid": testId,
  ...props
}: Readonly<
  ComponentProps<typeof Field> & {
    id: string;
    label: string;
    value: Date | undefined;
    onValueChange: (value: Date | undefined) => void;
    "data-testid": string;
  }
>) {
  const [open, setOpen] = useState(false);

  return (
    <Field {...props}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="w-full justify-between"
            data-testid={testId}
          >
            {value ? value.toLocaleDateString("pt-BR") : "Selecionar data"}
            <CalendarBlankIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={value}
            onSelect={(date) => {
              onValueChange(date);
              setOpen(false);
            }}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export { DatePickerField };
