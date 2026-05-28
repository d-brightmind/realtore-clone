import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { db } from "../firebase";
import type { Listing } from "../pages/Listing";

interface Landlord {
  name: string;
  email: string;
}

interface ContactProps {
  userRef: string;
  listing: Listing;
}

export default function Contact({ userRef, listing }: ContactProps) {
  const [landlord, setLandlord] = useState<Landlord | null>(null);
  const [message, setMessage] = useState<string>("");

  useEffect(() => {
    async function getLandlord(): Promise<void> {
      const docRef = doc(db, "users", userRef);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setLandlord(docSnap.data() as Landlord);
      } else {
        toast.error("Could not get landlord data");
      }
    }
    getLandlord();
  }, [userRef]);

  if (!landlord) return null;

  return (
    <div className="flex flex-col w-full">
      <p>
        Contact {landlord.name} for the {listing.name.toLowerCase()}
      </p>
      <div className="mt-3 mb-6">
        <textarea
          name="message"
          id="message"
          rows={2}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-600"
        />
      </div>
      
        <a href={`mailto:${landlord.email}?Subject=${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`}>
        <button
          type="button"
          className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full text-center mb-6"
        >
          Send Message
        </button>
      </a>
    </div>
  );
}