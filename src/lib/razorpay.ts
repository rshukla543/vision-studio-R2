import { supabase } from "@/lib/supabase";

export async function createRazorpayOrder(amount: number) {
  console.log("Creating Razorpay order for amount:", amount);

  const { data, error } = await supabase.functions.invoke("create-order", {
    body: { amount },
  });

  if (error) {
    console.error("Supabase function error:", error);
    throw new Error("Failed to create Razorpay order");
  }

  console.log("Razorpay order created:", data);
  return data;
}
