import { supabase } from "@/lib/supabaseClient";

export type ConnectionStatus = "pending" | "accepted" | "rejected";

export type ConnectionRequestRow = {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string | null;
  status: ConnectionStatus;
  created_at: string;
};

export async function fetchUserConnectionRequests(userId: string) {
  // We fetch anything where sender_id or receiver_id is the user
  return supabase
    .from("connect_requests")
    .select("*")
    .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`);
}

export async function sendConnectionRequest(
  senderId: string,
  receiverId: string,
  message: string
) {
  // The RPC or insert will check RLS
  return supabase.from("connect_requests").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    message: message.trim() || null,
    status: "pending",
  }).select().single();
}

export async function updateConnectionStatus(
  requestId: string,
  newStatus: "accepted" | "rejected"
) {
  return supabase
    .from("connect_requests")
    .update({ status: newStatus })
    .eq("id", requestId);
}

export async function cancelConnectionRequest(requestId: string) {
  return supabase
    .from("connect_requests")
    .delete()
    .eq("id", requestId)
    .eq("status", "pending");
}

export async function fetchAcceptedEmails(userId: string) {
  // Returns array of objects: { profile_id: string, email: string }
  return supabase
    .rpc("get_accepted_connection_emails", { current_user_id: userId });
}
