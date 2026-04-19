import { FcGoogle } from "react-icons/fc";
import { toast } from "react-toastify";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { db } from "../firebase";
import { getDoc, serverTimestamp, setDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router";

export default function OAuth() {
  const navigate = useNavigate();
  async function onGoogleClick() {
  try {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    
    //check user
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      await setDoc(docRef, {
        name: user.displayName,
        email: user.email,
        avatar: user.photoURL,
        timeStamp: serverTimestamp()
      });
    }
    navigate("/");

    toast.success("Google sign-in successful");
  } catch (error) {
    toast.error("Could not authorize with Google");
  }
}
  return (
    <button onClick={onGoogleClick} type="button" className="flex items-center justify-center w-full bg-red-700 text-white px-7 py-3 uppercase text-sm font-medium hover:bg-red-800 active:bg-red-900 shadow-md
    hover:shadow-lg transition duration-150 ease-in-out rounded cursor-pointer">
        <FcGoogle className="mr-2 text-2xl rounded-full bg-white" />
      Continue with Google
    </button>
  )
}
