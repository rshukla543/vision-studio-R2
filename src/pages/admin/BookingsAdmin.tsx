import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BookingsCalendar } from "./BookingsCalendar";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Mail, Phone, Clock, User, Camera, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

export default function BookingsAdmin() {
  const [bookings, setBookings] = useState<any[]>([]);
  // const [selectedDate, setSelectedDate] = useState<string | null>(new Date().toISOString().split('T')[0]);
  const [selectedDate, setSelectedDate] = useState<string | null>(format(new Date(), 'yyyy-MM-dd'));

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    const { data } = await supabase.from("bookings").select("*").order("created_at", { ascending: false });
    if (data) setBookings(data);
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
    <div className="max-w-6xl mx-auto py-16 px-6 space-y-16">
      {/* SECTION 1: HEADER & CALENDAR */}
      <section className="space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-[0.4em] text-primary font-bold">Inventory Control</span>
            <h2 className="font-serif text-4xl text-white mt-2">Master <span className="italic text-primary">Schedule</span></h2>
          </div>

          {selectedDate && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={blockDateManually}
              // className="group relative px-8 py-3 bg-red-500/10 border border-red-500/30 rounded-full overflow-hidden transition-all hover:bg-red-500"
              className="group relative px-8 py-3 bg-red-500/10 border border-red-500/30 rounded-full overflow-hidden transition-all hover:bg-red-500"
            >
              <span className="relative z-10 text-[10px] uppercase tracking-widest font-bold text-red-500 group-hover:text-white">
              {/* <span className="relative z-10 text-[10px] text-primary uppercase tracking-widest font-bold text-red-500 group-hover:text-white"> */}
                Book {format(new Date(`${selectedDate}T00:00:00`), "MMM dd")}
              </span>
            </motion.button>
          )}
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 rounded-[40px] p-2 backdrop-blur-3xl shadow-2xl">
          <div className="bg-white/[0.02] rounded-[38px] p-8 md:p-12">
            <BookingsCalendar
              bookings={bookings}
              selectedDate={selectedDate}
              onSelect={setSelectedDate}
            />
          </div>
        </div>
      </section>

      {/* SECTION 2: DETAIL TABLE */}
      <AnimatePresence mode="wait">
        {selectedDate && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            className="relative"
          >
            <div className="flex justify-between items-center mb-8 px-4">
              <div>
                <h3 className="text-primary uppercase tracking-[0.3em] text-[10px] font-bold mb-1">Agenda for</h3>
                <h4 className="text-3xl font-serif text-white uppercase tracking-tighter">
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
                  <table className="w-full text-left border-separate border-spacing-y-2">
                    <thead>
                      <tr className="text-white/20 text-[9px] uppercase tracking-[0.2em]">
                        <th className="px-6 py-4 font-semibold">Client / ID</th>
                        <th className="px-6 py-4 font-semibold">Service Type</th>
                        <th className="px-6 py-4 font-semibold">Contact Info</th>
                        <th className="px-6 py-4 font-semibold text-right">Management</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleBookings.map((b) => (
                        <tr key={b.id} className="group bg-white/[0.02] hover:bg-white/[0.05] transition-all duration-500">
                          <td className="px-6 py-6 rounded-l-2xl border-l border-y border-white/5">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-black border border-white/10 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                                <User className="w-4 h-4 text-primary" />
                              </div>
                              <div>
                                <p className="text-white font-medium tracking-tight text-sm">{b.customer_name || "Blocked Date"}</p>
                                <p className="text-[9px] text-white/30 font-mono mt-1">REF: {b.id.slice(0, 8).toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 border-y border-white/5">
                            <div className="flex items-center gap-2 text-white/60">
                              <Camera className="w-3.5 h-3.5 text-primary/40" />
                              <span className="text-xs uppercase tracking-widest text-[10px] font-medium">{b.service_selected || "Manual Block"}</span>
                            </div>
                          </td>
                          <td className="px-6 py-6 border-y border-white/5">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 text-[11px] text-white/40 group-hover:text-white/70 transition-colors">
                                <Mail className="w-3 h-3" /> {b.customer_email || "N/A"}
                              </div>
                              <div className="flex items-center gap-2 text-[11px] text-white/40 group-hover:text-white/70 transition-colors">
                                <Phone className="w-3 h-3" /> {b.customer_phone || "Internal"}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-6 rounded-r-2xl border-r border-y border-white/5 text-right">
                            <div className="flex justify-end items-center gap-3">
                              {b.status === "pending" ? (
                                <>
                                  <button onClick={() => updateStatus(b.id, "confirmed")} className="px-4 py-2 bg-white text-black text-[10px] font-bold rounded-full hover:bg-primary transition shadow-lg shadow-white/5">
                                    CONFIRM
                                  </button>
                                  <button onClick={() => deleteBooking(b.id)} className="p-2 border border-white/10 rounded-full hover:bg-red-500/20 hover:text-red-500 transition text-white/30">
                                    <X className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <div className="flex items-center gap-4">
                                  <span className={`text-[9px] uppercase tracking-widest px-3 py-1 rounded-full border ${b.status === 'confirmed' ? 'border-primary/30 text-primary bg-primary/5' : 'border-white/10 text-white/20'}`}>
                                    {b.status}
                                  </span>
                                  <button
                                    onClick={() => deleteBooking(b.id)}
                                    className="opacity-0 group-hover:opacity-100 transition-opacity text-white/20 hover:text-red-400 p-1"
                                    title="Delete Record"
                                  >
                                    <X className="w-3.5 h-3.5" />
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

      {/* REMOVED THE UGLY DEBUG TABLE - ITS INTEGRATED NOW */}
    </div>
      );
}
