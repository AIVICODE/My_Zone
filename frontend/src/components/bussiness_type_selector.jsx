import React from 'react';

const BusinessTypeSelector = ({ businessType, setBusinessType }) => {
    return (
      <div className="flex flex-col gap-2 w-full md:w-1/2">
        <label className="text-gray-700 font-medium">Business Type</label>
        <select
          value={businessType}
          onChange={(e) => setBusinessType(e.target.value)}
          className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="">Select a category</option>

          {/* Food & Beverage */}
          <option value="amenity=cafe">Cafe</option>
          <option value="amenity=restaurant">Restaurant</option>
          <option value="amenity=fast_food">Fast Food</option>
          <option value="amenity=bar">Bar</option>
          <option value="amenity=ice_cream">Ice Cream Shop</option>
          <option value="shop=bakery">Bakery</option>

          {/* Retail */}
          <option value="shop=clothes">Clothing Store</option>
          <option value="shop=supermarket">Supermarket</option>
          <option value="shop=furniture">Furniture Store</option>
          <option value="shop=electronics">Electronics Store</option>
          <option value="shop=convenience">Convenience Store</option>
          <option value="shop=florist">Florist</option>
          <option value="shop=butcher">Butcher Shop</option>
          <option value="shop=beauty">Beauty Store</option>

          {/* Services */}
          <option value="amenity=pharmacy">Pharmacy</option>
          <option value="amenity=bank">Bank</option>
          <option value="amenity=atm">ATM</option>
          <option value="amenity=car_rental">Car Rental</option>
          <option value="shop=hairdresser">Hairdresser</option>
          <option value="amenity=post_office">Post Office</option>

          {/* Education */}
          <option value="amenity=school">School</option>
          <option value="amenity=university">University</option>
          <option value="amenity=kindergarten">Kindergarten</option>
          <option value="amenity=library">Library</option>

          {/* Offices and Businesses */}
          <option value="office=coworking">Coworking Space</option>
          <option value="office=company">Corporate Office</option>
          <option value="office=estate_agent">Real Estate Agency</option>
          <option value="office=government">Government Office</option>
          <option value="office=insurance">Insurance Office</option>
          <option value="office=lawyer">Law Office</option>
          <option value="office=telecommunication">Telecommunications</option>

          {/* Tourism and Accommodation */}
          <option value="tourism=hotel">Hotel</option>
          <option value="tourism=guest_house">Guest House</option>
          <option value="tourism=hostel">Hostel</option>
          <option value="tourism=motel">Motel</option>
          <option value="tourism=information">Tourist Information Center</option>

          {/* Healthcare */}
          <option value="amenity=clinic">Clinic</option>
          <option value="amenity=dentist">Dentist</option>
          <option value="amenity=hospital">Hospital</option>
          <option value="amenity=doctors">Doctor's Office</option>
          <option value="amenity=optician">Optician</option>

          {/* Fitness and Recreation */}
          <option value="leisure=fitness_centre">Gym</option>
          <option value="leisure=sports_centre">Sports Center</option>
          <option value="leisure=swimming_pool">Swimming Pool</option>
          <option value="leisure=park">Park</option>

          {/* Others */}
          <option value="amenity=parking">Parking</option>
          <option value="amenity=marketplace">Marketplace</option>
          <option value="amenity=place_of_worship">Place of Worship</option>
        </select>
      </div>
    );
};

export default BusinessTypeSelector;