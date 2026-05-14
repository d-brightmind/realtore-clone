import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";

interface Landlord {
  name: string;
  email: string;
}

interface Listing {
  name: string;
  type: "rent" | "sale";
}

interface ContactProps {
  userRef: string;
  listing: Listing;
}

interface ContactResult {
  landlord: Landlord | null;
  message: string;
  setMessage: (msg: string) => void;
  getMailtoLink: () => string;
}

async function fetchLandlord(userRef: string): Promise<Landlord | null> {
  const docRef = doc(db, "users", userRef);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as Landlord;
  } else {
    console.error("Could not get landlord data");
    return null;
  }
}

function buildMailtoLink(landlord: Landlord, listing: Listing, message: string): string {
  return `mailto:${landlord.email}?Subject=${encodeURIComponent(listing.name)}&body=${encodeURIComponent(message)}`;
}

export async function initContact({ userRef, listing }: ContactProps): Promise<ContactResult> {
  const landlord = await fetchLandlord(userRef);
  let message = "";

  return {
    landlord,
    message,
    setMessage(msg: string) {
      message = msg;
    },
    getMailtoLink() {
      if (!landlord) return "";
      return buildMailtoLink(landlord, listing, message);
    },
  };
}