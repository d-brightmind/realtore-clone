import { doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";

interface Listing {
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
  description: string;
  geolocation: { lat: number; lng: number };
  timestamp: any;
}

export default function Listing() {
  const params = useParams<{ listingId: string }>();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchListing() {
      const docRef = doc(db, "listings", params.listingId!);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setListing(docSnap.data() as Listing);
        setLoading(false);
      }
    }
    fetchListing();
  }, [params.listingId]);

  if (loading) return <Spinner />;
  if (!listing) return null; // ✅ guards against listing being null after loading

  return (
    <main>
      <Swiper
        slidesPerView={1}
        navigation
        pagination={{ type: "progressbar" }}
        effect="fade"
        modules={[EffectFade, Autoplay, Navigation, Pagination]}
        autoplay={{ delay: 3000 }}
      >
        {listing.imgUrls.map((url, index) => (
          <SwiperSlide key={index}>
            <div
              className="relative w-full overflow-hidden h-75"
              style={{
                background: `url(${url}) center no-repeat`,
                backgroundSize: "cover",
              }}
            ></div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}