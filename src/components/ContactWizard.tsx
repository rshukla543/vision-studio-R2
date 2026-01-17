import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar as CalendarIcon, Package, User, Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import PayNowButton from '@/components/PayNowButton';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { supabase } from '@/lib/supabase';

const packages = [
  { id: 'essential', name: 'Essential', price: '₹75,000', deposit: '₹25,000', description: '6 hours coverage, 300+ photos' },
  { id: 'premium', name: 'Premium', price: '₹1,50,000', deposit: '₹50,000', description: 'Full day coverage, 600+ photos, pre-wedding' },
  { id: 'luxury', name: 'Luxury', price: '₹2,50,000', deposit: '₹75,000', description: 'Multi-day coverage, cinematic film, album' },
  { id: 'newborn', name: 'Newborn', price: '₹25,000', deposit: '₹10,000', description: '3 hours studio session, 50+ edited photos' },
];

const eventTypes = ['Wedding', 'Pre-Wedding', 'Newborn', 'Engagement', 'Anniversary', 'Other'];

interface FormData {
  eventType: string;
  eventDate: string;
  venue: string;
  guestCount: string;
  packageId: string;
  name: string;
  email: string;
  phone: string;
  message: string;
}

export function ContactWizard() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [step, setStep] = useState(1);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    eventType: '',
    eventDate: '',
    venue: '',
    guestCount: '',
    packageId: '',
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.2 });
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const selectedPackage = packages.find(p => p.id === formData.packageId);
  // FIX: Ensure this is a clean integer. The "Paise" conversion (x100) should happen ONLY ONCE in the API call.
  const depositAmount = selectedPackage ? parseInt(selectedPackage.deposit.replace(/[₹,]/g, ''), 10) : 0;

  const validateStep = (currentStep: number): boolean => {
    if (currentStep === 1) {
      return formData.eventType !== '' && formData.eventDate !== '';
    }
    if (currentStep === 2) {
      return formData.packageId !== '';
    }
    if (currentStep === 3) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const isEmailValid = emailRegex.test(formData.email);
      const isPhoneValid = formData.phone.replace(/\D/g, '').length >= 10;
      const isNameValid = formData.name.trim().length >= 2;
      return isNameValid && isEmailValid && isPhoneValid;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setStep(prev => Math.min(prev + 1, 3));
    } else {
      let desc = "Complete all required fields before proceeding.";
      if (step === 3) desc = "Please provide a valid name, email, and 10-digit phone number.";
      toast({ title: "Action Required", description: desc, variant: "destructive" });
    }
  };

  const steps = [
    { number: 1, title: 'Event Details', icon: CalendarIcon },
    { number: 2, title: 'Select Package', icon: Package },
    { number: 3, title: 'Your Details', icon: User },
  ];

  const [bookedDates, setBookedDates] = useState<Date[]>([]);

  useEffect(() => {
    const getBookedDates = async () => {
      const { data } = await supabase
        .from("bookings")
        .select("booking_date")
        .in("status", ["confirmed", "pending"]);

      if (data) {
        // Convert strings from DB to JS Date objects
        const dates = data.map(b => new Date(b.booking_date));
        setBookedDates(dates);
      }
    };
    getBookedDates();
  }, []);

  return (

    <section ref={sectionRef} className="py-32 bg-charcoal-deep overflow-hidden">
      {/* <style dangerouslySetInnerHTML={{
        __html: `
        .rdp { --rdp-accent-color: #D4AF37; }
        .rdp-day_selected { background-color: #D4AF37 !important; color: black !important; }
      `}} /> */}
      <style dangerouslySetInnerHTML={{
        __html: `
    .rdp { --rdp-accent-color: #D4AF37; --rdp-background-color: transparent; }
    
    /* The core selected day */
    .rdp-day_selected { 
      background-color: #D4AF37 !important; 
      color: black !important; 
      font-weight: bold !important;
    }

    /* Past Dates: Faded out */
    .rdp-day_disabled:not(.booked-day) {
      opacity: 0.15 !important;
      text-decoration: none !important;
      cursor: not-allowed !important;
    }

    /* Blocked/Booked Dates: Reddish hue & Strikethrough */
    .booked-day {
      color: #ef4444 !important; /* Red-500 */
      background-color: rgba(239, 68, 68, 0.05) !important;
      text-decoration: line-through !important;
      opacity: 0.5 !important;
      cursor: not-allowed !important;
      border: 1px solid rgba(239, 68, 68, 0.2) !important;
    }
  `}} />

      <div className="container mx-auto px-6">
        <div className="max-w-4xl mx-auto">
          <div className={cn('text-center mb-16 transition-all duration-1000 ease-out', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12')}>
            <span className="text-xs tracking-[0.3em] uppercase text-primary font-bold">Let's Create Together</span>
            <h2 className="font-serif text-4xl md:text-6xl font-light text-foreground mt-4">
              Book Your <span className="italic text-primary">Session</span>
            </h2>
          </div>

          <div className={cn('flex justify-center mb-12 transition-all duration-1000 delay-300 ease-out', isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10')}>
            <div className="flex items-center gap-4">
              {steps.map((s, index) => (
                <div key={s.number} className="flex items-center">
                  <div className={cn('flex items-center gap-3 px-4 py-2 rounded-sm transition-all duration-300', step >= s.number ? 'bg-primary/10' : 'bg-transparent')}>
                    <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm',
                      step > s.number ? 'bg-primary text-primary-foreground' : step === s.number ? 'border-2 border-primary text-primary shadow-[0_0_15px_rgba(212,175,55,0.2)]' : 'border border-border text-muted-foreground')}>
                      {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                    </div>
                    <span className={cn('hidden md:block text-sm', step >= s.number ? 'text-foreground' : 'text-muted-foreground')}>{s.title}</span>
                  </div>
                  {index < steps.length - 1 && <div className={cn('w-8 md:w-16 h-px mx-2', step > s.number ? 'bg-primary' : 'bg-border')} />}
                </div>
              ))}
            </div>
          </div>

          <div className={cn(
            'bg-[#111111] border border-white/[0.03] p-8 md:p-12 min-h-[550px] flex flex-col relative',
            'shadow-[0_10px_30px_rgba(0,0,0,0.5),0_30px_70px_rgba(0,0,0,0.3)] transition-all duration-700 delay-500 ease-out',
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'
          )}>
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

            {/* FLICKER FIX: Changed slide-in to pure fade-in for smoother step transitions */}
            <div key={step} className="flex-1 animate-in fade-in duration-700 fill-mode-both">
              {step === 1 && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Event Type *</label>
                      <select value={formData.eventType} onChange={(e) => updateFormData('eventType', e.target.value)} className="w-full bg-transparent border-b border-border/50 py-3 text-foreground focus:border-primary focus:outline-none appearance-none cursor-pointer">
                        <option value="" className="bg-charcoal">Select event type</option>
                        {eventTypes.map(type => <option key={type} value={type} className="bg-charcoal">{type}</option>)}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Event Date *</label>
                      <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="w-full justify-start text-left bg-transparent border-0 border-b border-border/50 rounded-none py-3 px-0 h-auto hover:bg-transparent">
                            <CalendarIcon className="mr-2 h-4 w-4 text-primary" />
                            {formData.eventDate ? format(new Date(formData.eventDate), "PPP") : <span className="text-muted-foreground/50">Pick a date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0 bg-black border-primary/20" align="start">
                          <Calendar
                            mode="single"
                            selected={formData.eventDate ? new Date(formData.eventDate) : undefined}
                            onSelect={(date) => {
                              updateFormData(
                                'eventDate',
                                date ? format(date, "yyyy-MM-dd") : ""
                              );
                              // updateFormData('eventDate', date?.toISOString());
                              // updateFormData('eventDate', date?.toISOString() || '');
                              setCalendarOpen(false);
                            }}
                            // Define which dates are 'booked' so we can style them differently from 'past' dates
                            modifiers={{
                              booked: bookedDates // Pass your array of Date objects here
                            }}
                            modifiersClassNames={{
                              booked: "booked-day" // This matches the CSS we wrote above
                            }}
                            // --- ADD THIS PROP ---
                            disabled={(date) => {
                              // 1. Disable past dates
                              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));

                              // 2. Disable dates already in our bookedDates array
                              const isBooked = bookedDates.some(bookedDate =>
                                format(bookedDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
                              );

                              return isPast || isBooked;
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Venue</label>
                      <input type="text" value={formData.venue} onChange={(e) => updateFormData('venue', e.target.value)} placeholder="Venue name" className="w-full bg-transparent border-b border-border/50 py-3 focus:border-primary focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs tracking-[0.2em] uppercase text-muted-foreground">Expected Guests</label>
                      <input type="text" value={formData.guestCount} onChange={(e) => updateFormData('guestCount', e.target.value)} placeholder="e.g., 200" className="w-full bg-transparent border-b border-border/50 py-3 focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  {packages.map((pkg) => (
                    <button key={pkg.id} onClick={() => updateFormData('packageId', pkg.id)} className={cn('p-6 text-left border transition-all', formData.packageId === pkg.id ? 'border-primary bg-primary/5' : 'border-border/20 hover:border-primary/40')}>
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-serif text-xl">{pkg.name}</h3>
                        <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center', formData.packageId === pkg.id ? 'border-primary bg-primary' : 'border-border')}>
                          {formData.packageId === pkg.id && <Check className="w-3 h-3 text-primary-foreground" />}
                        </div>
                      </div>
                      <p className="text-2xl font-light text-primary mb-2">{pkg.price}</p>
                      <p className="text-sm text-muted-foreground">{pkg.description}</p>
                    </button>
                  ))}
                </div>
              )}

              {step === 3 && (
                <div className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs tracking-[0.2em] uppercase text-primary font-bold">Your Name *</label>
                      <input type="text" value={formData.name} onChange={(e) => updateFormData('name', e.target.value)} placeholder="Full name" className="w-full bg-transparent border-b border-border/50 py-3 focus:border-primary focus:outline-none" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs tracking-[0.2em] uppercase text-primary font-bold">Email Address *</label>
                      <input type="email" value={formData.email} onChange={(e) => updateFormData('email', e.target.value)} placeholder="your@email.com" className="w-full bg-transparent border-b border-border/50 py-3 focus:border-primary focus:outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs tracking-[0.2em] uppercase text-primary font-bold">Phone Number *</label>
                    <input type="tel" value={formData.phone} onChange={(e) => updateFormData('phone', e.target.value)} placeholder="+91 00000 00000" className="w-full bg-transparent border-b border-border/50 py-3 focus:border-primary focus:outline-none" />
                  </div>
                  <div className="p-6 bg-primary/5 border border-primary/20 rounded-sm">
                    <div className="flex justify-between items-center text-sm font-serif">
                      <span className="text-muted-foreground uppercase text-[10px] tracking-widest">Deposit Amount</span>
                      <span className="text-primary text-xl">{selectedPackage?.deposit}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row justify-between gap-4 mt-12 pt-8 border-t border-border/30">
              
              {/* BACK BUTTON: Full width on mobile, auto on desktop */}
              <Button 
                variant="outline" 
                onClick={() => setStep(prev => Math.max(prev - 1, 1))} 
                disabled={step === 1}
                className={cn(
                  "h-12 text-xs tracking-widest uppercase transition-all",
                  "w-full sm:w-auto" // Mobile: Full width, Desktop: Auto
                )}
              >
                {/* <ChevronLeft className="w-4 h-4 mr-2" />  */}
                Back
              </Button>
            
              {/* ACTION BUTTON: Continue or Pay Now */}
              <div className="w-full sm:w-auto">
                {step < 3 ? (
                  <Button 
                    variant="gold" 
                    onClick={nextStep}
                    className="w-full sm:w-auto h-12 text-xs tracking-widest uppercase font-bold px-10"
                  >
                    Continue 
                    {/* <ChevronRight className="w-4 h-4 ml-2" /> */}
                  </Button>
                ) : (
                  <div className="animate-in fade-in zoom-in-95 duration-500 w-full sm:w-auto">
                    <PayNowButton
                      amount={depositAmount}
                      customerDetails={{ ...formData, booking_date: formData.eventDate }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
