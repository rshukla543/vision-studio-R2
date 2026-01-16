import { supabase } from "@/lib/supabase";

const ADMIN_EMAIL = "rishabh.shkl.98@gmail.com";

export async function isAdmin() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;
  return user.email === ADMIN_EMAIL;
}
