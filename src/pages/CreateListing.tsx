import React from 'react';

export default function CreateListing() {
    const [ formData, setFormData ] = React.useState({
        type: "rent",
        name: "",
        bedrooms: 1,
        bathrooms: 1,
        parking: "false",
        furnished: "false",
        offer: "true",
        address: "",
        description: "",
        regularPrice: 1,
        discountedPrice: 1
    });
    const {type, name, bedrooms, bathrooms, parking, furnished, offer, address, description, regularPrice, discountedPrice} = formData;

function onChange() {

}
  return (
    <main className="max-w-md mx-auto px-2">
      <h1 className="text-3xl text-center mt-6 font-bold">Create a Listing</h1>
      <form action="">
        <p className="text-lg mt-6 font-semibold ">Sell / Rent</p>
        <div className="flex">
            <button type="button" className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-white text-black" : "bg-slate-600 text-white"}`} id="type" value="sale" onClick={onChange}>Sell
            </button>
            <button type="button" className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${type === "rent" ? "bg-slate-600 text-white" : "bg-white text-black"}`} id="type" value="rent" onClick={onChange}>Rent
            </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Name</p>
        <input type="text" id='name' value={name} onChange={onChange} placeholder='Name' maxLength={32} minLength={10} required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-40 mb-6'/>
        <div className="flex space-x-6">
          <div className="">
            <p className='text-xl font-semibold'>Beds</p>
            <input type="number" id='bedrooms' value={bedrooms} onChange={onChange} min="1" max="50" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-40 text-center'/>
          </div>
          <div className=''>
            <p className='text-xl font-semibold'>Baths</p>
            <input type="number" id='bathrooms' value={bathrooms} onChange={onChange} min="1" max="50" required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-40 text-center'/>
          </div>
        </div>
        <p className="text-lg mt-6 font-semibold ">Parking Spot</p>
        <div className="flex">
            <button type="button" className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking === "true" ? "bg-slate-600 text-white"  : "bg-white text-black"}`} id="parking" value="true" onClick={onChange}>Yes
            </button>
            <button type="button" className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${parking === "false" ? "bg-slate-600 text-white" : "bg-white text-black"}`} id="parking" value="false" onClick={onChange}>No
            </button>
        </div>
        <p className="text-lg mt-6 font-semibold ">Furnished</p>
        <div className="flex">
            <button type="button" className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished === "true" ? "bg-slate-600 text-white"  : "bg-white text-black"}`} id="furnished" value="true" onClick={onChange}>Yes
            </button>
            <button type="button" className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${furnished === "false" ? "bg-slate-600 text-white" : "bg-white text-black"}`} id="furnished" value="false" onClick={onChange}>No
            </button>
        </div>
        <p className="text-lg mt-6 font-semibold">Address</p>
        <textarea id='address' value={address} onChange={onChange} placeholder='Address' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-40 mb-6'/>
        <p className="text-lg font-semibold">Description</p>
        <textarea id='de' value={description} onChange={onChange} placeholder='Description' required className='w-full px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-40 mb-6'/>
        <p className="text-lg font-semibold ">Offer</p>
        <div className="flex mb-6">
            <button type="button" className={`mr-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer === "true" ? "bg-slate-600 text-white"  : "bg-white text-black"}`} id="offer" value="true" onClick={onChange}>Yes
            </button>
            <button type="button" className={`ml-3 px-7 py-3 font-medium text-sm uppercase shadow-md rounded hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150 ease-in-out w-full ${offer === "false" ? "bg-slate-600 text-white" : "bg-white text-black"}`} id="offer" value="false" onClick={onChange}>No
            </button>
        </div>
        <div className="flex items-center mb-6 w-full">
          <div className="w-full">
            <p className="text-lg font-semibold">Regular Price</p>
            <div className='flex w-full space-x-6'>
              <input type="number" id='regularPrice' value={regularPrice} onChange={onChange} min={50} max={4000000000} required className=' px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-400 text-center'/>
                {type === "rent" && (
                  <div className="flex items-center">
                      <p className="text-md w-full whitespace-nowrap">$ Per Month</p>
                  </div>
                )}
            </div>
          </div>
        </div>
        {offer === "true" && (
            <div className="flex items-center mb-6 w-full">
            <div className="w-full">
              <p className="text-lg font-semibold">Discounted Price</p>
              <div className='flex w-full space-x-6 '>
                <input type="number" id='discountedPrice' value={discountedPrice} onChange={onChange} min={50} max={4000000000} required className=' px-4 py-2 text-xl text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:text-gray-700 focus:bg-white focus:border-slate-400 text-center'/>
                  {type === "rent" && (
                    <div className="flex items-center">
                        <p className="text-md w-full whitespace-nowrap">$ Per Month</p>
                    </div>
                  )}
              </div>
            </div>
          </div>
        )}
        <div className="mb-6">
          <p className='text-lg font-semibold'>Images</p>
          <p className='text-gray-600'>The first image will be the cover {"max 6"} </p>
          <input type="file" id='image' onChange={onChange} accept='.jpg, .png, jpeg' multiple required className='w-full px-3 py-1.5 text-gray-700 bg-white border border-gray-300 rounded transition duration-150 ease-in-out focus:bg-white focus:border-slate-600'/>
        </div>
        <button type="submit" className='mb-6 w-full px-7 py-3 bg-blue-600 text-white font-medium text-sm uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out'>
          Create Listing
        </button>
      </form>
    </main>
  )
}
