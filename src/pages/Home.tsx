import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ListingItem from "../components/ListingItem";
import Slider from "../components/Slider";
import { db } from "../firebase";

interface ListingData {
  name: string;
  type: "rent" | "sale";
  address: string;
  regularPrice: number;
  discountedPrice?: number;
  offer: boolean;
  bedrooms: number;
  bathrooms: number;
  parking: boolean;
  furnished: boolean;
  imgUrls: string[];
  userRef: string;
  timestamp: Timestamp;
}

interface ListingWithId {
  id: string;
  data: ListingData;
}

async function fetchListings(filters: Parameters<typeof where>[]): Promise<ListingWithId[]> {
  const listingsRef = collection(db, "listings");
  const q = query(listingsRef, ...filters.map((f) => where(...f)), orderBy("timestamp", "desc"), limit(4));
  const querySnap = await getDocs(q);
  return querySnap.docs.map((doc) => ({
    id: doc.id,
    data: doc.data() as ListingData,
  }));
}

export default function Home() {
  const [offerListings, setOfferListings] = useState<ListingWithId[]>([]);
  const [rentListings, setRentListings] = useState<ListingWithId[]>([]);
  const [saleListings, setSaleListings] = useState<ListingWithId[]>([]);

  useEffect(() => {
    async function loadAll(): Promise<void> {
      try {
        const [offers, rent, sale] = await Promise.all([
          fetchListings([["offer", "==", true]]),
          fetchListings([["type", "==", "rent"]]),
          fetchListings([["type", "==", "sale"]]),
        ]);
        setOfferListings(offers);
        setRentListings(rent);
        setSaleListings(sale);
      } catch (error) {
        console.error(error);
      }
    }
    loadAll();
  }, []);

  return (
    <div>
      <Slider />
      <div className="max-w-6xl mx-auto pt-4 space-y-6">
        {offerListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Recent offers</h2>
            <Link to="/offers">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more offers
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {offerListings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </div>
        )}
        {rentListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places for rent</h2>
            <Link to="/category/rent">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for rent
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {rentListings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </div>
        )}
        {saleListings.length > 0 && (
          <div className="m-2 mb-6">
            <h2 className="px-3 text-2xl mt-6 font-semibold">Places for sale</h2>
            <Link to="/category/sale">
              <p className="px-3 text-sm text-blue-600 hover:text-blue-800 transition duration-150 ease-in-out">
                Show more places for sale
              </p>
            </Link>
            <ul className="sm:grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {saleListings.map((listing) => (
                <ListingItem key={listing.id} listing={listing.data} id={listing.id} />
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}