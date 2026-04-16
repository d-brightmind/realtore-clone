import { FcGoogle } from "react-icons/fc";


export default function OAuth() {
  return (
    <button className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md
    hover:shadow-lg transition duration-150 ease-in-out rounded">
        <FcGoogle className="mr-2 text-2xl rounded-full bg-white" />
      Continue with Google
    </button>
  )
}
