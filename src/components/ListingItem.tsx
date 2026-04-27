import moment from "moment";
import { Link } from "react-router-dom";
import { MdLocationOn } from "react-icons/md";
import { FaTrash } from "react-icons/fa";
import { MdEdit } from "react-icons/md";

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
  timestamp: { toDate: () => Date } | null;
}

interface ListingItemProps {
  listing: Listing;
  id: string;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ListingItem({ listing, id, onEdit, onDelete }: ListingItemProps) {
  return (
    <li className="relative bg-white flex flex-col justify-between items-center shadow-md hover:shadow-xl rounded-md overflow-hidden transition-shadow duration-150 m-2.5">
      <Link className="contents" to={`/category/${listing.type}/${id}`}>
        <img
          className="h-42.5 w-full object-cover hover:scale-105 transition-scale duration-200 ease-in"
          loading="lazy"
          src={listing.imgUrls[0]}
          alt={listing.name}
        />
        <span className="absolute top-2 left-2 bg-[#3377cc] text-white uppercase text-xs font-semibold rounded-md px-2 py-1 shadow-lg">
          {moment(listing.timestamp?.toDate()).fromNow()}
        </span>
        <div className="w-full p-2.5">
          <div className="flex items-center space-x-1">
            <MdLocationOn className="h-4 w-4 text-green-600" />
            <p className="font-semibold text-sm mb-0.5 text-gray-600 truncate">
              {listing.address}
            </p>
          </div>
          <p className="font-semibold m-0 text-xl truncate">{listing.name}</p>
          <p className="text-[#457b9d] mt-2 font-semibold">
            $
            {listing.offer
              ? listing.discountedPrice!
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              : listing.regularPrice
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            {listing.type === "rent" && " / month"}
          </p>
          <div className="flex items-center mt-2.5 space-x-3">
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bedrooms > 1 ? `${listing.bedrooms} Beds` : "1 Bed"}
              </p>
            </div>
            <div className="flex items-center space-x-1">
              <p className="font-bold text-xs">
                {listing.bathrooms > 1
                  ? `${listing.bathrooms} Baths`
                  : "1 Bath"}
              </p>
            </div>
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
          className="absolute bottom-2 right-7 h-4 cursor-pointer "
          onClick={() => onEdit(id)}
        />
      )}
    </li>
  );
}