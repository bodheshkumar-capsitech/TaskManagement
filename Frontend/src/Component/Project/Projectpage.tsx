import { Button } from "@fluentui/react-components";
import type { ProjectPageProps } from "../../types/Project/ProjectPageProps";
import { Calendar } from "@fluentui/react-calendar-compat";
import { useState, useRef, useEffect } from "react";

const Projectpage = ({
  page,
  total,
  pageSize,
  onPage,
  year,
  month,
  onYearChange,
  onMonthChange
}: ProjectPageProps) => {

  const filterRef = useRef<HTMLDivElement>(null);
  const totalPages = Math.ceil(total / pageSize);
  const [date, setDate] = useState<Date>(new Date(year, month - 1));
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setShowCalendar(false);
      }
    };

    if (showCalendar) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showCalendar]);

  const pages = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  const handleDateChange = (newDate: Date | undefined) => {
    if (!newDate) return;

    setDate(newDate);

    const selectedMonth = newDate.getMonth() + 1;
    const selectedYear = newDate.getFullYear();

    console.log(
      "Selected month:",
      selectedMonth,
      "Selected year:",
      selectedYear
    );

    onMonthChange(selectedMonth);
    onYearChange(selectedYear);
    setShowCalendar(false)
  };


  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
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
              className={`
            cursor-pointer
            text-sm
            px-1
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
      </div>
      <div className="flex flex-row items-center gap-4">
        <div className="relative" ref={filterRef}>
          <Button onClick={() => setShowCalendar(prev => !prev)} className="!rounded-xl">
            Select Month
          </Button>
          {showCalendar &&
            <div className="absolute z-50 left-1/2 -translate-x-1/2 top-full mt-3">
              <Calendar
                value={date}
                highlightSelectedMonth
                isDayPickerVisible={false}
                onSelectDate={handleDateChange}
                className="absolute z-50 top-full bg-[#EEF2FF] border-[#4F46E5] border-1 left-1/2 -translate-x-1/2 rounded-2xl !mx-4 sm:mx-auto"
              />
            </div>
          }
        </div>
        <div>
          {page}/{pageSize}
        </div>
      </div>
    </div>
  );
};

export default Projectpage;