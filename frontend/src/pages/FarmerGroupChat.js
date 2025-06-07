import React, { useEffect, useRef, useState } from "react";
import { db, auth, storage } from "../firebase";
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, startAfter, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { onAuthStateChanged } from "firebase/auth";
import { UserCircle, Image as ImageIcon, Send, Loader2 } from "lucide-react";
import GroupChatHeader from "../components/GroupChatHeader";

const GROUP_ID = "demo-group"; // Replace with dynamic groupId as needed

export default function FarmerGroupChat() {
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState(null);
  const messagesEndRef = useRef(null);

  // Auth
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  // Initial load and real-time updates
  useEffect(() => {
    const q = query(
      collection(db, `groups/${GROUP_ID}/messages`),
      orderBy("timestamp", "desc"),
      limit(100)
    );
    const unsub = onSnapshot(q, (snap) => {
      const msgs = [];
      snap.forEach(doc => msgs.push({ id: doc.id, ...doc.data() }));
      setMessages(msgs.reverse());
      setLastDoc(snap.docs[snap.docs.length - 1]);
    });
    return () => unsub();
  }, []);

  // Scroll to latest
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  // Load older messages
  const loadOlder = async () => {
    if (!lastDoc) return;
    setLoadingMore(true);
    const q = query(
      collection(db, `groups/${GROUP_ID}/messages`),
      orderBy("timestamp", "desc"),
      startAfter(lastDoc),
      limit(50)
    );
    const snap = await getDocs(q);
    const older = [];
    snap.forEach(doc => older.push({ id: doc.id, ...doc.data() }));
    setMessages(prev => [...older.reverse(), ...prev]);
    setLastDoc(snap.docs[snap.docs.length - 1]);
    setLoadingMore(false);
  };

  // Send message (text or image)
  const sendMessage = async () => {
    if (!user || (!input.trim() && !image)) return;
    setLoading(true);
    let imageUrl = "";
    if (image) {
      const imgRef = ref(storage, `group_images/${GROUP_ID}/${Date.now()}_${image.name}`);
      await uploadBytes(imgRef, image);
      imageUrl = await getDownloadURL(imgRef);
    }
    await addDoc(collection(db, `groups/${GROUP_ID}/messages`), {
      senderId: user.uid,
      senderName: user.displayName || "Anonymous",
      senderPhoto: user.photoURL || "",
      message: input,
      type: image ? "image" : "text",
      imageUrl,
      timestamp: serverTimestamp(),
    });
    setInput("");
    setImage(null);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col">
      <GroupChatHeader groupId={GROUP_ID} />
      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full bg-white rounded-2xl shadow-lg mt-6 mb-4 overflow-hidden">
        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2" style={{ minHeight: 400 }}>
          {loadingMore && <div className="text-center text-xs text-gray-400 mb-2"><Loader2 className="inline animate-spin" /> Loading older messages...</div>}
          <button onClick={loadOlder} className="block mx-auto mb-2 text-xs text-blue-600 hover:underline">Load older messages</button>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-xs px-4 py-2 rounded-2xl shadow ${msg.senderId === user?.uid ? "bg-green-200 text-right" : "bg-blue-100 text-left"} mb-1`}>
                <div className="flex items-center gap-2 mb-1">
                  {msg.senderPhoto
                    ? <img src={msg.senderPhoto} alt="profile" className="w-6 h-6 rounded-full" />
                    : <UserCircle className="w-6 h-6 text-green-600" />}
                  <span className="font-semibold text-xs">{msg.senderName}</span>
                  {msg.senderId === user?.uid && <span className="ml-2 text-xs text-green-700 font-bold">(You)</span>}
                </div>
                {msg.type === "image" && msg.imageUrl && (
                  <img src={msg.imageUrl} alt="sent" className="rounded-lg mb-1 max-h-48" />
                )}
                {msg.message && <div className="break-words">{msg.message}</div>}
                <div className="text-xs text-gray-500 mt-1">{msg.timestamp?.toDate?.().toLocaleString?.() || ""}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        {/* Input */}
        <div className="border-t p-3 flex gap-2 items-center bg-gray-50">
          <input
            className="flex-1 border rounded-lg p-2 focus:outline-none"
            placeholder="Type a message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            disabled={loading}
          />
          <label className="cursor-pointer">
            <ImageIcon className="w-6 h-6 text-blue-500" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={e => setImage(e.target.files[0])}
              disabled={loading}
            />
          </label>
          <button
            onClick={sendMessage}
            className="bg-green-600 text-white px-4 py-2 rounded-lg font-bold shadow hover:bg-green-700 flex items-center gap-1"
            disabled={loading || (!input.trim() && !image)}
          >
            {loading ? <Loader2 className="animate-spin" /> : <Send />}
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
