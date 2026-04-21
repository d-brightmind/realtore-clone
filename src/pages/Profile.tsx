import { getAuth } from 'firebase/auth';
import React from 'react';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify/unstyled';
import { updateProfile } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';


export default function Profile() {
  const auth = getAuth();
  const navigate = useNavigate();
  const [changeDetails, setChangeDetails] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: auth.currentUser?.displayName || 'Ridwan',
    email: auth.currentUser?.email || 'ridwan@example.com'
  });

  const {name, email} = formData;

  function onLogOut() {
    auth.signOut();
    navigate("/sign-in");
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.id]: e.target.value
    }))
  }

  async function onSubmit() {
    try {
      if (auth.currentUser?.displayName !== name) {
        await updateProfile(auth.currentUser!, {
          displayName: name
        });
        const docRef = doc(db, "users", auth.currentUser!.uid);
        await updateDoc(docRef, {
          name,
        });
      }
        toast.success("Profile details updated");
    } catch (error) {
      toast.error("Could not update profile details");
    }
  }

  return (
    <>
      <section className="max-w-6xl mx-auto flex justify-center items-center flex-col">
        <h1 className="text-3xl text-center mt-6 font-bold">My Profile</h1>
        <div className="w-full md:w-[50%] mt-6 px-3">
          <form action="">
            {/*Name Input*/}

            <input className={`mb-6 w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition ease-in-out ${
                changeDetails && "bg-red-200 focus:bg-red-200"
              }`} onChange={onChange} value={name} id="name" type='text' disabled={!changeDetails}/>
            
            {/*Email Input*/}

            <input className='w-full px-4 py-2 text-xl text-gray-700 bg-white border-gray-300 rounded transition ease-in-out' disabled type="email" id="email" value={email} onChange={onChange} />

            <div className='flex justify-between mt-6 mb-6 text-sm sm:text-lg whitespace-nowrap '>
              <p className='flex items-center  '>Do you want to change your name?
                <span className='text-red-600 hover:text-red-700 transition ease-in-out duration-200 ml-1 cursor-pointer' onClick={() => {
                  changeDetails && onSubmit()
                 setChangeDetails((prevState) => !prevState)}}>
                 {changeDetails ? 'Apply Changes' : 'Edit'}
                 </span></p>
                
              <p className='text-blue-600 hover:text-blue-800 transition duration-200 ease-in-out cursor-pointer' onClick={onLogOut}>Sign out</p>
            </div>
          </form>
        </div>
      </section>
    </>
  )
}
