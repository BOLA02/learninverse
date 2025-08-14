"use client";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { useAuth } from "@/contexts/AuthContext";

const NoteInbox = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchNotes = async () => {
      if (!user) return;
      setLoading(true);
      setError("");
      try {
        const q = query(
          collection(db, "notes"),
          where("recipientId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const notesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setNotes(notesData);
        // Log notes to console for debugging
        // eslint-disable-next-line no-console
        console.log("Fetched notes for inbox:", notesData);
      } catch (err: any) {
        setError("Failed to fetch notes");
        // eslint-disable-next-line no-console
        console.error("Error fetching notes:", err);
      }
      setLoading(false);
    };
    fetchNotes();
  }, [user]);

  if (!user) return <div>Please log in to view your notes.</div>;
  if (loading) return <div>Loading notes...</div>;
  if (error) return <div className="text-red-600">{error}</div>;

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Notes Inbox</h2>
      {notes.length === 0 ? (
        <div>No notes received.</div>
      ) : (
        <ul className="space-y-4">
          {notes.map(note => (
            <li key={note.id} className="border rounded p-4 bg-white shadow">
              <div className="font-semibold">From: {note.senderName || note.senderId}</div>
              <div className="text-gray-700 mb-2">{note.content}</div>
              <div className="text-xs text-gray-500">{note.createdAt?.toDate ? note.createdAt.toDate().toLocaleString() : note.createdAt}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NoteInbox;
