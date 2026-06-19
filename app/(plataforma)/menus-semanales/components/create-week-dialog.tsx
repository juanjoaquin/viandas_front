"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarDays, CalendarIcon, Plus } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { TWeekMenu } from "@/src/architecture/core/domain/entities/WeekMenu";
import { createWeekMenuAction } from "@/src/architecture/actions/week-menu/create-week-menu.action";

function isDateOccupied(date: Date, existingWeeks: TWeekMenu[]): boolean {
    const day = format(date, "yyyy-MM-dd");

    return existingWeeks.some(
        (week) => day >= week.week_start_date && day <= week.week_end_date,
    );
}

function formatRangeLabel(range: DateRange | undefined): string {
    if (!range?.from) {
        return "Seleccioná el rango de fechas";
    }

    if (!range.to) {
        return `${format(range.from, "d 'de' MMMM yyyy", { locale: es })} — elegí la fecha de fin`;
    }

    const sameYear = range.from.getFullYear() === range.to.getFullYear();
    const sameMonth = sameYear && range.from.getMonth() === range.to.getMonth();

    if (sameMonth) {
        return `${format(range.from, "d", { locale: es })} al ${format(range.to, "d 'de' MMMM yyyy", { locale: es })}`;
    }

    if (sameYear) {
        return `${format(range.from, "d 'de' MMMM", { locale: es })} al ${format(range.to, "d 'de' MMMM yyyy", { locale: es })}`;
    }

    return `${format(range.from, "d 'de' MMMM yyyy", { locale: es })} al ${format(range.to, "d 'de' MMMM yyyy", { locale: es })}`;
}

type CreateWeekDialogProps = {
    existingWeeks: TWeekMenu[];
};

export function CreateWeekDialog({ existingWeeks }: CreateWeekDialogProps) {
    const [open, setOpen] = useState(false);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
    const [awaitingEndDate, setAwaitingEndDate] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const isRangeComplete = Boolean(dateRange?.from && dateRange?.to);

    function handleSelectRange(range: DateRange | undefined) {
        if (!range?.from) {
            setDateRange(undefined);
            setAwaitingEndDate(false);
            return;
        }

        const isSameDayPartial =
            range.to !== undefined &&
            range.from.getTime() === range.to.getTime();

        // Primer clic: react-day-picker a veces setea from y to iguales; esperamos el segundo
        if (!range.to || (isSameDayPartial && !awaitingEndDate)) {
            setDateRange({ from: range.from, to: undefined });
            setAwaitingEndDate(true);
            return;
        }

        setDateRange(range);
        setAwaitingEndDate(false);
        setCalendarOpen(false);
    }

    function handleOpenChange(value: boolean) {
        if (!value) {
            setDateRange(undefined);
            setAwaitingEndDate(false);
            setCalendarOpen(false);
        }
        setOpen(value);
    }

    async function handleSubmit() {
        if (!dateRange?.from || !dateRange?.to) return;

        setIsSubmitting(true);

        try {
            const result = await createWeekMenuAction({
                week_start_date: format(dateRange.from, "yyyy-MM-dd"),
                week_end_date: format(dateRange.to, "yyyy-MM-dd"),
            });

            if (result.success) {
                toast.success("Semana creada correctamente");
                router.push(`/menus-semanales?weekMenuId=${result.data!.id}`);
                setOpen(false);
                setDateRange(undefined);
                return;
            }

            toast.error(result.error);
        } catch (error) {
            console.error(error);
            toast.error("Error inesperado al crear la semana");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="brand">
                    <Plus data-icon="inline-start" />
                    Nueva semana
                </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-sm">
                <DialogHeader>
                    <DialogTitle className="text-base font-semibold">
                        Crear semana
                    </DialogTitle>
                    <DialogDescription>
                        Elegí la fecha de inicio y la de fin del menú semanal.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-3 py-2">
                    <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                className={cn(
                                    "w-full justify-start text-left font-normal sm:min-w-[320px]",
                                    !dateRange?.from && "text-muted-foreground",
                                )}
                            >
                                <CalendarIcon className="mr-2 size-4 shrink-0" />
                                {formatRangeLabel(dateRange)}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                mode="range"
                                defaultMonth={dateRange?.from}
                                selected={dateRange}
                                onSelect={handleSelectRange}
                                locale={es}
                                disabled={(date) => {
                                    if (isDateOccupied(date, existingWeeks)) {
                                        return true;
                                    }

                                    if (dateRange?.from && !dateRange?.to) {
                                        return date < dateRange.from;
                                    }

                                    return false;
                                }}
                            />
                        </PopoverContent>
                    </Popover>

                    {isRangeComplete && dateRange?.from && dateRange?.to && (
                        <div className="rounded-lg border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
                            <span className="font-medium text-foreground">Inicio:</span>{" "}
                            {format(dateRange.from, "EEEE d 'de' MMMM yyyy", { locale: es })}
                            <br />
                            <span className="font-medium text-foreground">Fin:</span>{" "}
                            {format(dateRange.to, "EEEE d 'de' MMMM yyyy", { locale: es })}
                        </div>
                    )}
                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button
                        variant="brand"
                        disabled={!isRangeComplete || isSubmitting}
                        onClick={() => void handleSubmit()}
                    >
                        <CalendarDays data-icon="inline-start" />
                        {isSubmitting ? "Creando..." : "Crear semana"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
