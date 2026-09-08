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
        <div className="grid grid-cols-2 sm:grid-cols-3 items-center gap-3 mb-4">
            <div className="col-span-2 sm:col-span-1 flex flex-row justify-center sm:justify-start items-center">
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
                <div className="relative flex justify-start sm:justify-center" ref={filterRef}>
                    <Button onClick={() => setShowCalendar(prev => !prev)} className="!rounded-xl">
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
                            className="absolute z-50 top-full bg-[#EEF2FF] border-[#4F46E5] border-1 left-1/2 -translate-x-1/2 rounded-2xl !mx-3 sm:!mx-auto" />
                    </div>
                }
                </div>
            <div className="flex justify-end">
                <DatePicker
                    placeholder="Select a date..."
                    value={date}
                    // minDate={new Date()}
                    onSelectDate={(selectedDate) => {
                        onDateChange(selectedDate ?? null);
                    }}
                    className="!w-[140px] sm:!w-auto"
                />
            </div>
        </div>
    );
};

export default TodoPage;  