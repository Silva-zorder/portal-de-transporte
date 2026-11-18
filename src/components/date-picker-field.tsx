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

type DateRangeValue = { from: Date | undefined; to?: Date | undefined };

const formatDay = (date: Date) => date.toLocaleDateString("pt-BR");

/** Um único campo de período: o calendário escolhe a data inicial e a final. */
function DateRangePickerField({
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
    value: DateRangeValue | undefined;
    onValueChange: (value: DateRangeValue | undefined) => void;
    "data-testid": string;
  }
>) {
  const [open, setOpen] = useState(false);
  const text = value?.from
    ? `${formatDay(value.from)} – ${value.to ? formatDay(value.to) : "…"}`
    : "Selecionar período";

  return (
    <Field {...props}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            variant="outline"
            className="w-full justify-between font-normal"
            data-testid={testId}
          >
            {text}
            <CalendarBlankIcon />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={value}
            defaultMonth={value?.from}
            onSelect={onValueChange}
            locale={ptBR}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

export { DatePickerField, type DateRangeValue, DateRangePickerField };
