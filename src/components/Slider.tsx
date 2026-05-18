import { collection, getDocs, limit, orderBy, query, Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import Spinner from "../components/Spinner";
import { db } from "../firebase";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css/bundle";
import { useNavigate } from "react-router-dom";

interface ListingData {
  name: string;
  type: "rent" | "sale";
  imgUrls: string[];
  regularPrice: number;
  discountedPrice?: number;
  timestamp: Timestamp;
}

interface ListingWithId {
  id: string;
  data: ListingData;
}

export default function Slider() {
  const [listings, setListings] = useState<ListingWithId[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchListings(): Promise<void> {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      const fetched: ListingWithId[] = querySnap.docs.map((doc) => ({
        id: doc.id,
        data: doc.data() as ListingData,
      }));

      setListings(fetched);
      setLoading(false);
    }

    fetchListings();
  }, []);

  if (loading) return <Spinner />;
  if (!listings || listings.length === 0) return null;

  return (
    <Swiper
      slidesPerView={1}
      navigation
      pagination={{ type: "progressbar" }}
      effect="fade"
      modules={[EffectFade, Autoplay, Navigation, Pagination]}
      autoplay={{ delay: 3000 }}
    >
      {listings.map(({ data, id }) => (
        <SwiperSlide
          key={id}
          onClick={() => navigate(`/category/${data.type}/${id}`)}
        >
          <div
            style={{
              background: `url(${data.imgUrls[0]}) center no-repeat`,
              backgroundSize: "cover",
            }}
            className="relative w-full h-75 overflow-hidden"
          />
          <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
            {data.name}
          </p>
          <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
            ${(data.discountedPrice ?? data.regularPrice).toLocaleString("en-US")}
            {data.type === "rent" && " / month"}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}