type ListingItemProps = {
  listing: { name: string };
  id: string;
};

export default function ListingItem({ listing, id }: ListingItemProps) {
  return <div>{listing.name}</div>;
}