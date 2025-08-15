import { useState } from "react";
import { toast } from "sonner";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

const NoteForm = () => {
  const [content, setContent] = useState("");
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // Find recipient UID by email
  const getRecipientIdByEmail = async (email: string) => {
    // This assumes you have a 'users' collection in Firestore with email and uid fields
    const q = query(collection(db, "users"), where("email", "==", email));
    const snapshot = await getDocs(q);
    if (!snapshot.empty) {
      return snapshot.docs[0].id;
    }
    // Debug: print all user emails in the collection
    const allUsersSnap = await getDocs(collection(db, "users"));
    const allEmails = allUsersSnap.docs.map(doc => doc.data().email);
    // eslint-disable-next-line no-console
    console.log("All user emails in Firestore:", allEmails);
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!user) return;
    if (!content.trim()) {
      setError("Note content cannot be empty.");
      return;
    }
    if (!recipientEmail.trim()) {
      setError("Recipient email is required.");
      return;
    }
    setSending(true);
    const recipientId = await getRecipientIdByEmail(recipientEmail.trim());
    // eslint-disable-next-line no-console
    console.log("DEBUG: recipientId found for email", recipientEmail, ":", recipientId);
    if (!recipientId) {
      setError("Recipient not found.");
      setSending(false);
      return;
    }
    await addDoc(collection(db, "notes"), {
      content,
      senderId: user.uid,
      senderName: user.displayName || user.email,
      recipientId,
      recipientEmail,
      createdAt: serverTimestamp(),
    });
    // Log and toast for successful note delivery
    // eslint-disable-next-line no-console
    console.log("Note sent successfully to:", recipientEmail, "with recipientId:", recipientId);
    toast.success("Note sent successfully!");
    setContent("");
    setRecipientEmail("");
    setSending(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <div>
        <label className="block mb-1 font-medium">Recipient Email</label>
        <input
          type="email"
          value={recipientEmail}
          onChange={e => setRecipientEmail(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Note</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        type="submit"
        disabled={sending}
        className="bg-sky-600 text-white px-4 py-2 rounded hover:bg-sky-700"
      >
        {sending ? "Sending..." : "Send Note"}
      </button>
    </form>
  );
};

export default NoteForm;
