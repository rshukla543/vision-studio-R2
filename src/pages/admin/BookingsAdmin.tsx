import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookingsCalendar } from "./BookingsCalendar";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Mail, Phone, Clock, User, Camera, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  // const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase
      .from("bookings")
      .update({
        status,
        confirmed_at: status === "confirmed" ? new Date().toISOString() : null
      })
      .eq("id", id);

    if (!error) fetchBookings();
  };

  // const visibleBookings = bookings.filter(b => b.booking_date === selectedDate);
  const normalize = (d: string) => d.split("T")[0];

  // const visibleBookings = bookings.filter(
  //   b => normalize(b.booking_date) === normalize(selectedDate!)
  // );
  const blockDateManually = async () => {
    if (!selectedDate) return;

    const { error } = await supabase.from("bookings").insert({
      booking_date: selectedDate,
      customer_name: "MANUAL BLOCK",
      status: "confirmed",
      notes: "Blocked by Admin"
      // Note: payment_id can be null here if you didn't set the NOT NULL constraint yet
    });

    if (!error) {
      fetchBookings(); // Refresh the list and calendar dots
      toast({ title: "Date Blocked", description: `${selectedDate} is now unavailable.` });
    }
  };

  const deleteBooking = async (id: string) => {
    if (!confirm("Are you sure you want to delete/unblock this date?")) return;

    const { error } = await supabase
      .from("bookings")
      .delete()
      .eq("id", id);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: "Booking/Block removed." });
      fetchBookings(); // Refresh the list and calendar
    }
  };

  const visibleBookings = bookings.filter((b) => {
    if (!b.booking_date || !selectedDate) return false;
    // This ensures we only compare the YYYY-MM-DD part directly from the strings
    const bDate = b.booking_date.split('T')[0];
    const sDate = selectedDate.split('T')[0];
    return bDate === sDate;
  });

  return (
    <section className="text-foreground max-w-7xl mx-auto">
      {/* ---------- HEADER ---------- */}
      <div className="flex items-center gap-6 mb-12">
        <h2 className="text-[11px] font-sans font-bold tracking-[0.5em] uppercase text-primary whitespace-nowrap">
          Inventory Control
        </h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
      </div>

      <div className="mb-8">
        <h2 className="text-5xl md:text-7xl font-serif text-white leading-[1.1] tracking-tight">
          Master <span className="italic opacity-30 font-light underline decoration-primary/20 underline-offset-8">Schedule</span>
        </h2>
        <p className="text-muted-foreground mt-6 text-base tracking-wide max-w-lg leading-relaxed opacity-70">
          Manage bookings and calendar availability.
        </p>
      </div>

      <div className="space-y-12 md:space-y-16">
        {/* SECTION 1: CALENDAR */}
        <div className="space-y-6 md:space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 sm:gap-6">
            {selectedDate && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={blockDateManually}
                className="group relative px-6 sm:px-8 py-3 bg-red-500/10 border border-red-500/30 rounded-full overflow-hidden transition-all hover:bg-red-500"
              >
                <span className="relative z-10 text-[10px] uppercase tracking-widest font-bold text-red-500 group-hover:text-white">
                  Block {format(new Date(`${selectedDate}T00:00:00`), "MMM dd")}
                </span>
              </motion.button>
            )}
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-2 md:p-4 backdrop-blur-3xl shadow-2xl">
            <div className="bg-white/[0.02] rounded-[38px] p-4 sm:p-6 md:p-8 lg:p-12">
              <BookingsCalendar
                bookings={bookings}
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                loading={loading}
              />
            </div>
          </div>
        </div>
        {/* MOBILE VIEW */}
        <div className="space-y-4 md:hidden">
          {visibleBookings.length === 0 ? (
            <div className="py-16 text-center bg-[#0A0A0A] border border-white/5 rounded-[40px]">
              <div className="inline-block p-4 rounded-full bg-white/[0.02] mb-4 border border-white/5">
                <CalendarIcon className="w-6 h-6 text-white/10" />
              </div>
              <p className="text-white/20 italic tracking-[0.2em] uppercase text-[10px]">No engagements scheduled for this date</p>
            </div>
          ) : (
            visibleBookings.map((b) => (
              <div
                key={b.id}
                className="bg-[#0A0A0A] border border-white/5 rounded-2xl p-4 space-y-4 backdrop-blur-2xl"
              >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-black border border-white/10 flex items-center justify-center">
            <User className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-white text-sm font-medium">
              {b.customer_name || "Blocked Date"}
            </p>
            <p className="text-[9px] text-white/30 font-mono">
              REF {b.id.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        <span className={`text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border
          ${b.status === "confirmed"
            ? "border-primary/30 text-primary bg-primary/5"
            : "border-white/10 text-white/30"}`}
        >
          {b.status}
        </span>
      </div>

      {/* Service */}
      <div className="flex items-center gap-2 text-white/50 text-[10px] uppercase tracking-widest">
        <Camera className="w-3.5 h-3.5 text-primary/40" />
        {b.service_selected || "Manual Block"}
      </div>

      {/* Contact */}
      <div className="space-y-1 text-[11px] text-white/40">
        <div className="flex items-center gap-2">
          <Mail className="w-3 h-3" /> {b.customer_email || "N/A"}
        </div>
        <div className="flex items-center gap-2">
          <Phone className="w-3 h-3" /> {b.customer_phone || "Internal"}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-2">
        {b.status === "pending" ? (
          <>
            <button
              onClick={() => updateStatus(b.id, "confirmed")}
              className="px-4 py-2 bg-white text-black text-[10px] font-bold rounded-full"
            >
              CONFIRM
            </button>
            <button
              onClick={() => deleteBooking(b.id)}
              className="p-2 border border-white/10 rounded-full text-white/40"
            >
              <X className="w-4 h-4" />
            </button>
          </>
        ) : (
          <button
            onClick={() => deleteBooking(b.id)}
            className="text-red-400 text-[10px] uppercase tracking-widest"
          >
            Delete
          </button>
        )}
              </div>
            </div>
            ))
          )}
        </div>

        {/* SECTION 2: DETAIL TABLE (DESKTOP) */}
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              className="relative hidden md:block"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                  <h3 className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold mb-1">Agenda for</h3>
                  <h4 className="text-2xl md:text-3xl font-serif text-white uppercase tracking-tighter">
                    {format(new Date(`${selectedDate}T00:00:00`), "EEEE, MMMM do")}
                  </h4>
                </div>
                <div className="px-4 py-1 bg-white/5 rounded-full border border-white/10">
                  <span className="text-white/40 text-[10px] uppercase tracking-widest">{visibleBookings.length} Record(s)</span>
                </div>
              </div>

              <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] overflow-hidden backdrop-blur-3xl">
                {visibleBookings.length > 0 ? (
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-left border-separate border-spacing-y-2 min-w-[600px]">
                      <thead>
                        <tr className="text-white/20 text-[9px] uppercase tracking-[0.2em]">
                          <th className="px-4 lg:px-6 py-4 font-semibold">Client / ID</th>
                          <th className="px-4 lg:px-6 py-4 font-semibold">Service Type</th>
                          <th className="px-4 lg:px-6 py-4 font-semibold">Contact Info</th>
                          <th className="px-4 lg:px-6 py-4 font-semibold text-right">Management</th>
                        </tr>
                      </thead>
                      <tbody>
                        {visibleBookings.map((b) => (
                          <tr key={b.id} className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500">
                            <td className="px-4 lg:px-6 py-4 lg:py-6 rounded-l-2xl border-l border-y border-white/5">
                              <div className="flex items-center gap-3 lg:gap-4">
                                <div className="w-10 h-10 lg:w-12 lg:h-12 rounded-full bg-black border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-colors flex-shrink-0">
                                  <User className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-primary" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-white font-medium tracking-tight text-xs lg:text-sm truncate">{b.customer_name || "Blocked Date"}</p>
                                  <p className="text-[9px] text-white/30 font-mono mt-1">REF: {b.id.slice(0, 8).toUpperCase()}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 lg:py-6 border-y border-white/5">
                              <div className="flex items-center gap-2 text-white/60">
                                <Camera className="w-3 h-3 lg:w-3.5 lg:h-3.5 text-primary/40 flex-shrink-0" />
                                <span className="text-[9px] lg:text-[10px] uppercase tracking-widest font-medium truncate">{b.service_selected || "Manual Block"}</span>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 lg:py-6 border-y border-white/5">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2 text-[10px] lg:text-[11px] text-white/40 group-hover:text-white/70 transition-colors">
                                  <Mail className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{b.customer_email || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-2 text-[10px] lg:text-[11px] text-white/40 group-hover:text-white/70 transition-colors">
                                  <Phone className="w-3 h-3 flex-shrink-0" /> <span className="truncate">{b.customer_phone || "Internal"}</span>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 lg:px-6 py-4 lg:py-6 rounded-r-2xl border-r border-y border-white/5 text-right">
                              <div className="flex justify-end items-center gap-2 lg:gap-3">
                                {b.status === "pending" ? (
                                  <>
                                    <button onClick={() => updateStatus(b.id, "confirmed")} className="px-3 lg:px-4 py-1.5 lg:py-2 bg-white text-black text-[9px] lg:text-[10px] font-bold rounded-full hover:bg-primary transition shadow-lg shadow-white/5 whitespace-nowrap">
                                      CONFIRM
                                    </button>
                                    <button onClick={() => deleteBooking(b.id)} className="p-1.5 lg:p-2 border border-white/10 rounded-full hover:bg-red-500/20 hover:text-red-500 transition text-white/30">
                                      <X className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
                                    </button>
                                  </>
                                ) : (
                                  <div className="flex items-center gap-3 lg:gap-4">
                                    <span className={`text-[8px] lg:text-[9px] uppercase tracking-widest px-2 lg:px-3 py-1 rounded-full border ${b.status === 'confirmed' ? 'border-primary/30 text-primary bg-primary/5' : 'border-white/10 text-white/20'}`}>
                                      {b.status}
                                    </span>
                                    <button
                                      onClick={() => deleteBooking(b.id)}
                                      className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400 p-1"
                                      title="Delete Record"
                                    >
                                      <X className="w-3 h-3 lg:w-3.5 lg:h-3.5" />
                                    </button>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="py-24 text-center">
                    <div className="inline-block p-4 rounded-full bg-white/[0.02] mb-4 border border-white/5">
                      <CalendarIcon className="w-6 h-6 text-white/10" />
                    </div>
                    <p className="text-white/20 italic tracking-[0.2em] uppercase text-[10px]">No engagements scheduled for this date</p>
                  </div>
                )}
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
