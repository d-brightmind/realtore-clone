import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <h1 className="text-3xl font-bold mb-3">Page not found</h1>
      <p className="text-gray-600 mb-6">
        The page you're looking for doesn't exist or may have moved.
      </p>
      <Link
        to="/"
        className="px-7 py-3 bg-blue-600 text-white rounded text-sm uppercase shadow-md hover:bg-blue-700"
      >
        Back to home
      </Link>
    </div>
  );
}
