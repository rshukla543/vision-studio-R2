import { useState } from "react";
import {
  addDays, format, startOfMonth, endOfMonth,
  startOfWeek, endOfWeek, isSameMonth, isSameDay,
  addMonths, subMonths
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type Booking = {
  booking_date: string;
  status: string;
};

type Props = {
  bookings: Booking[];
  selectedDate: string | null;
  onSelect: (date: string) => void;
  loading?: boolean;
};

const CalendarSkeleton = () => (
  <div className="grid grid-cols-7 gap-[1px]">
    {[...Array(35)].map((_, i) => (
      <div
        key={i}
        className="h-12 sm:h-16 md:h-24 lg:h-28 bg-white/[0.04] animate-pulse rounded-[6px]"
      />
    ))}
  </div>
);

export function BookingsCalendar({ bookings, selectedDate, onSelect, loading = false }: Props) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const renderHeader = () => (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8">
      <h2 className="text-xl md:text-2xl font-light tracking-tight text-white uppercase">
        {format(currentMonth, "MMMM")} <span className="text-primary font-medium">{format(currentMonth, "yyyy")}</span>
      </h2>
      <div className="flex gap-2">
        <button
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          className="p-2 md:p-2.5 rounded-full hover:bg-white/10 transition border border-white/5"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-4 md:w-5 md:h-5" />
        </button>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-2 md:p-2.5 rounded-full hover:bg-white/10 transition border border-white/5"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-4 md:w-5 md:h-5" />
        </button>
      </div>
    </div>
  );

  const renderDays = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return (
      <div className="grid grid-cols-7 mb-2 md:mb-4">
        {days.map((day) => (
          <div key={day} className="text-center text-[9px] md:text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.slice(0, 1)}</span>
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const isSelected = selectedDate === formattedDate;
        const isCurrentMonth = isSameMonth(day, monthStart);

        // Status Logic
        const dayBookings = bookings.filter(b => b.booking_date === formattedDate);
        const status = dayBookings.some(b => b.status === "confirmed") ? "confirmed" :
          dayBookings.some(b => b.status === "pending") ? "pending" :
            dayBookings.some(b => b.status === "blocked") ? "blocked" : "free";

        const statusColors: any = {
          confirmed: "bg-red-500",
          pending: "bg-primary", // Gold for pending/new
          blocked: "bg-zinc-600",
          free: "bg-transparent",
        };


        // Inside renderCells, update the return block:
        days.push(
          <div
            key={day.toString()}
            className={`relative h-12 sm:h-16 md:h-24 lg:h-28 border-[0.5px] border-white/5 p-1 sm:p-1.5 md:p-2 lg:p-3 transition-all duration-300 group cursor-pointer
      ${!isCurrentMonth ? "opacity-10" : "opacity-100"}
      ${isSelected ? "bg-primary/10 shadow-[inset_0_0_20px_rgba(212,175,55,0.1)]" : "hover:bg-white/[0.03]"}
    `}
            onClick={() => onSelect(formattedDate)}
          >
            {/* Date Number - Refined Font */}
            <span className={`text-[9px] sm:text-[10px] md:text-xs font-medium tracking-tighter
 ${isSelected ? "text-primary" : "text-white/40 group-hover:text-white/80"}`}>
              {format(day, "d")}
            </span>

            {/* Status Indicators */}

            {/* {status !== "free" && (
              <div className="absolute inset-x-0 bottom-4 flex flex-col items-center gap-1.5">
                <div className={cn(
                  "h-1 rounded-full transition-all duration-500",
                  status === "confirmed" ? "w-8 bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                    status === "pending" ? "w-6 bg-primary shadow-[0_0_8px_rgba(212,175,55,0.4)]" :
                      "w-4 bg-zinc-600"
                )} />
                <span className="text-[7px] uppercase tracking-[0.2em] text-white/30 font-bold">
                  {status}
                </span>
              </div>
            )} */}

            {status !== "free" && (
              <>
                {/* MOBILE: Small dot */}
                <div className="absolute bottom-0.5 sm:bottom-1 left-1/2 -translate-x-1/2 md:hidden">
                  <div
                    className={cn(
                      "w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full",
                      status === "confirmed" && "bg-red-500",
                      status === "pending" && "bg-primary",
                      status === "blocked" && "bg-zinc-500"
                    )}
                  />
                </div>

                {/* TABLET: Medium indicator */}
                <div className="hidden md:flex lg:hidden absolute inset-x-0 bottom-2 flex-col items-center gap-1">
                  <div className={cn(
                    "h-0.5 rounded-full transition-all duration-500",
                    status === "confirmed" ? "w-6 bg-red-500/60" :
                    status === "pending" ? "w-5 bg-primary" :
                    "w-4 bg-zinc-600"
                  )} />
                </div>

                {/* DESKTOP: Bar + Label */}
                <div className="hidden lg:flex absolute inset-x-0 bottom-4 flex-col items-center gap-1.5">
                  <div className={cn(
                    "h-1 rounded-full transition-all duration-500",
                    status === "confirmed" ? "w-8 bg-red-500/60 shadow-[0_0_8px_rgba(239,68,68,0.4)]" :
                    status === "pending" ? "w-6 bg-primary shadow-[0_0_8px_rgba(212,175,55,0.4)]" :
                    "w-4 bg-zinc-600"
                  )} />
                  <span className="text-[7px] uppercase tracking-[0.2em] text-white/30 font-bold">
                    {status}
                  </span>
                </div>
              </>
            )}


            {/* Active Border Glow */}
            {isSelected && (
              <motion.div
                layoutId="activeDay"
                className="absolute inset-0 border-t border-l border-primary/40 pointer-events-none"
              />
            )}
          </div>
        );

        // days.push(
        //   <div
        //     key={day.toString()}
        //     className={`relative h-24 border-[0.5px] border-white/5 p-2 transition-all group cursor-pointer
        //       ${!isCurrentMonth ? "opacity-20" : "opacity-100"}
        //       ${isSelected ? "bg-white/[0.05]" : "hover:bg-white/[0.02]"}
        //     `}
        //     onClick={() => onSelect(formattedDate)}
        //   >
        //     <span className={`text-sm font-light ${isSelected ? "text-primary font-bold" : "text-white/70"}`}>
        //       {format(day, "d")}
        //     </span>

        //     {/* Status Indicator Dot */}
        //     {status !== "free" && (
        //       <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1">
        //         <div className={`w-1.5 h-1.5 rounded-full ${statusColors[status]}`} />
        //         <span className="text-[8px] uppercase tracking-tighter text-white/40">{status}</span>
        //       </div>
        //     )}

        //     {isSelected && (
        //       <motion.div 
        //         layoutId="activeDay" 
        //         className="absolute inset-0 border border-primary/50 pointer-events-none"
        //       />
        //     )}
        //   </div>
        // );
        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7" key={day.toString()}>{days}</div>);
      days = [];
    }
    return <div>{rows}</div>;
  };

  return (
    <div className="w-full">
      {renderHeader()}
      {renderDays()}
      <div className="border border-white/10 rounded-xl overflow-hidden bg-black/20 backdrop-blur-md min-h-[280px]">
        {loading ? (
          <div className="p-3 sm:p-4">
            <CalendarSkeleton />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="min-w-[320px]">
              {renderCells()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

