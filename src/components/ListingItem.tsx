import { Link } from "react-router-dom";
import { MdLocationOn, MdEdit } from "react-icons/md";
import { FaTrash } from "react-icons/fa";

interface Timestamp {
  toDate: () => Date;
}

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
  timestamp: Timestamp | null;
}

interface ListingItemProps {
  listing: Listing;
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

function formatPrice(price: number): string {
  return price.toLocaleString("en-US");
}

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  const units: { label: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
    { label: "year", seconds: 31536000 },
    { label: "month", seconds: 2592000 },
    { label: "week", seconds: 604800 },
    { label: "day", seconds: 86400 },
    { label: "hour", seconds: 3600 },
    { label: "minute", seconds: 60 },
    { label: "second", seconds: 1 },
  ];

  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

  for (const unit of units) {
    const delta = Math.floor(seconds / unit.seconds);
    if (delta >= 1) return rtf.format(-delta, unit.label);
  }

  return "just now";
}

export default function ListingItem({ listing, id, onEdit, onDelete }: ListingItemProps) {
  const displayPrice = listing.offer && listing.discountedPrice != null
    ? formatPrice(listing.discountedPrice)
    : formatPrice(listing.regularPrice);

  const timestamp = listing.timestamp?.toDate();

  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-2.5">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-42.5 w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt={listing.name}
        />
        {timestamp && (
          <span className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg">
            {timeAgo(timestamp)}
          </span>
        )}
        <div className="w-full p-2.5">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-0.5 text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold m-0 text-xl truncate">
            {listing.name}
          </p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            ${displayPrice}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-2.5 space-x-3">
            <p className="font-bold text-xs">
              {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
            </p>
            <p className="font-bold text-xs">
              {listing.bathrooms > 1 ? `${listing.bathrooms} Baths` : "1 Bath"}
            </p>
          </div>
        </div>
      </Link>
      {onDelete && (
        <FaTrash
          className="absolute bottom-2 right-2 h-3.5 cursor-pointer text-red-500"
          onClick={() => onDelete(id)}
        />
      )}
      {onEdit && (
        <MdEdit
          className="absolute bottom-2 right-7 h-4 cursor-pointer"
          onClick={() => onEdit(id)}
        />
      )}
    </li>
  );
}