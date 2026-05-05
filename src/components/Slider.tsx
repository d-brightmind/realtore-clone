import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";
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
  timestamp: any;
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
    async function fetchListings() {
      const listingsRef = collection(db, "listings");
      const q = query(listingsRef, orderBy("timestamp", "desc"), limit(5));
      const querySnap = await getDocs(q);

      const listings: ListingWithId[] = [];
      querySnap.forEach((doc) => {
        listings.push({
          id: doc.id,
          data: doc.data() as ListingData,
        });
      });

      setListings(listings);
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
          ></div>
          <p className="text-[#f1faee] absolute left-1 top-3 font-medium max-w-[90%] bg-[#457b9d] shadow-lg opacity-90 p-2 rounded-br-3xl">
            {data.name}
          </p>
          <p className="text-[#f1faee] absolute left-1 bottom-1 font-semibold max-w-[90%] bg-[#e63946] shadow-lg opacity-90 p-2 rounded-tr-3xl">
            ${data.discountedPrice ?? data.regularPrice}
            {data.type === "rent" && " / month"}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}