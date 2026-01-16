import { createRazorpayOrder } from "@/lib/razorpay";
import { useToast } from "@/hooks/use-toast";
import { toast } from "@/hooks/use-toast";
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface Props {
  amount: number;
  customerDetails: {
    name: string;
    email: string;
    phone: string;
    eventType: string;
    message: string;
    booking_date: string;
  };
}

export default function PayNowButton({ amount, customerDetails }: Props) {
  const { toast } = useToast();

  const handlePayment = async () => {
    // --- STEP 3 VALIDATION (SAME LOGIC AS WIZARD) ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isEmailValid = emailRegex.test(customerDetails.email);
    const isPhoneValid = customerDetails.phone.replace(/\D/g, '').length >= 10;
    const isNameValid = customerDetails.name.trim().length >= 2;

    if (!isNameValid || !isEmailValid || !isPhoneValid) {
      toast({ 
        title: "Action Required", 
        description: "Please provide a valid name, email, and 10-digit phone number.", 
        variant: "destructive" 
      });
      return; // STOPS the payment from opening
    }
    if (!customerDetails.booking_date || customerDetails.booking_date === "") {
    toast({ 
      title: "Date Missing", 
      description: "Please go back and select an event date.", 
      variant: "destructive" 
    });
    return;
  }

    try {
      // Amount is already an integer (e.g., 25000), createRazorpayOrder handles the x100 (Paise)
      const order = await createRazorpayOrder(amount);

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: "INR",
        name: "Cinematic Visions",
        description: `${customerDetails.eventType} Booking Deposit`,
        order_id: order.id,
        prefill: {
          name: customerDetails.name,
          email: customerDetails.email,
          contact: customerDetails.phone,
        },
        handler: async function (response: any) {
          try {
            const verifyRes = await fetch(
              `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/verify-payment`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
                  Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
                },
                body: JSON.stringify({
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  amount: order.amount, // Sending paise to DB (handled by Edge Function conversion)
                  customer_data: customerDetails,
                  
                }),
              }
            );

            if (verifyRes.ok) {
              toast({ title: "Success", description: "Your booking is confirmed." });
              // alert("Payment Successful! Your booking is confirmed.");
              // window.location.reload(); // Optional: refresh to reset wizard
            }
          } catch (err) {
            console.error("Verification failed", err);
          }
        },
        theme: {
          color: "#D4AF37",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment failed", err);
      toast({
        title: "Error",
        description: "Failed to initialize payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <button
      onClick={handlePayment}
      className="inline-flex items-center justify-center rounded-sm px-8 py-3 bg-primary text-black font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
    >
      Pay Deposit ₹{amount.toLocaleString('en-IN')}
    </button>
  );
}