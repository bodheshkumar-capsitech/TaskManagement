import { Button } from "@fluentui/react-components";
import type { TodoPageProps } from "../types/TodoPageProps";
import { Calendar } from "@fluentui/react-calendar-compat";
import { useState, useEffect, useRef } from "react";
import { DatePicker } from "@fluentui/react-datepicker-compat";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";


const TodoPage = ({
    page,
    total,
    pageSize,
    onPage,
    month,
    year,
    date,
    onMonthChange,
    onYearChange,
    onDateChange
}: TodoPageProps) => {

    const totalPages = Math.ceil(total / pageSize);
    const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
    const filterRef = useRef<HTMLDivElement>(null);
    const [showCalendar, setShowCalendar] = useState(false);
    const [newdate, setDate] = useState<Date>(
        new Date(year, month - 1)
    );

    useEffect(() => {

        const handleClickOutside = (event: MouseEvent) => {

            if (
                filterRef.current &&
                !filterRef.current.contains(event.target as Node)
            ) {
                setShowCalendar(false);
            }

        };

        if (showCalendar) {
            document.addEventListener(
                "mousedown",
                handleClickOutside
            );
        }

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };

    }, [showCalendar]);


    const handleDateChange = (
        newDate: Date | undefined
    ) => {

        if (!newDate) return;

        setDate(newDate);

        const selectedMonth =
            newDate.getMonth() + 1;

        const selectedYear =
            newDate.getFullYear();

        console.log(
            "Selected month:",
            selectedMonth,
            "Selected year:",
            selectedYear
        );

        onDateChange(null);
        onMonthChange(selectedMonth);
        onYearChange(selectedYear);

        setShowCalendar(false);
    };

    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-8">
            <div className="flex flex-row">
                <Button
                    appearance="transparent"
                    disabled={page === 1}
                    onClick={() => onPage(page - 1, pageSize)}
                >
                    Previous
                </Button>

                <div className="flex items-center gap-2">
                    {pages.map((pageNumber) => (
                        <span
                            key={pageNumber}
                            onClick={() => onPage(pageNumber, pageSize)}
                            className={`cursor-pointer text-sm px-1
                        ${page === pageNumber
                                    ? "font-bold text-blue-600"
                                    : "text-black hover:text-blue-600"
                                }
                        `}
                        >
                            {pageNumber}
                        </span>
                    ))}
                </div>

                <Button
                    appearance="transparent"
                    disabled={page === totalPages}
                    onClick={() => onPage(page + 1, pageSize)}
                >
                    Next
                </Button>
                <div>
                    {page}/{totalPages}
                </div>
            </div>
            <div className="relative" ref={filterRef}>
                <Button onClick={() =>
                    setShowCalendar(prev => !prev)
                }
                    className="!rounded-xl"
                >
                    Select Month
                </Button>
                {showCalendar
                    &&
                    <div className="absolute z-50 left-1/2 -translate-x-1/2 m-2 top-full">

                        <Calendar
                            value={newdate}
                            highlightSelectedMonth
                            isDayPickerVisible={false}
                            onSelectDate={handleDateChange}
                            className="absolute z-50 top-full bg-[#EEF2FF] border-[#4F46E5] border-1 left-1/2 -translate-x-1/2 rounded-2xl" />
                    </div>
                }
            </div>

            <DatePicker
                placeholder="Select a date..."
                value={date}
                // minDate={new Date()}
                onSelectDate={(selectedDate) => {
                    onDateChange(selectedDate ?? null);
                }}
            />
        </div>
    );
};

export default TodoPage;  