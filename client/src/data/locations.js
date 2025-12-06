export const indianCities = [
  'Pune', 'Patiala', 'Patna', 'Panaji', 'Parbhani', 'Pondicherry', 'Port Blair',
  'Mumbai', 'Delhi', 'Bangalore', 'Hyderabad', 'Chennai', 'Kolkata', 'Ahmedabad',
  'Jaipur', 'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal',
  'Visakhapatnam', 'Pimpri-Chinchwad', 'Patna', 'Vadodara', 'Ghaziabad',
  'Ludhiana', 'Agra', 'Nashik', 'Faridabad', 'Meerut', 'Rajkot', 'Kalyan-Dombivali',
  'Vasai-Virar', 'Varanasi', 'Srinagar', ' Aurangabad', 'Dhanbad', 'Amritsar',
  'Navi Mumbai', 'Allahabad', 'Howrah', 'Ranchi', 'Coimbatore', 'Jabalpur',
  'Vijayawada', 'Jodhpur', 'Madurai', 'Raipur', 'Kota', 'Chandigarh',
  'Guwahati', 'Hubli-Dharwad', 'Kochi', 'Cochin', 'Siliguri', 'Aizawl',
  'Ajmer', 'Aligarh', 'Amravati', 'Anand', 'Asansol', 'Bareilly', 'Belgaum',
  'Bhavnagar', 'Bhiwandi', 'Bikaner', 'Bilaspur', 'Bokaro', 'Burdwan',
  'Chandrapur', 'Darbhanga', 'Dehradun', 'Durgapur', 'Erode', 'Firozabad',
  'Gulbarga', 'Guntur', 'Gwalior', 'Hapur', 'Hubli', 'Indore', 'Jalgaon',
  'Jammu', 'Kannauj', 'Karnal', 'Kochi', 'Kolhapur', 'Kollam', 'Korba',
  'Kozhikode', 'Kurnool', 'Latur', 'Lonavla', 'Mathura', 'Mangalore',
  'Modinagar', 'Moradabad', 'Mysore', 'Nagpur', 'Nanded', 'Nashik',
  'Nellore', 'Noida', 'Ooty', 'Palakkad', 'Patiala', 'Patna', 'Pondicherry',
  'Puri', 'Raipur', 'Rajahmundry', 'Rajkot', 'Ranchi', 'Rourkela', 'Salem',
  'Sambalpur', 'Shimla', 'Silchar', 'Siliguri', 'Solapur', 'Srinagar',
  'Surat', 'Thane', 'Thiruvananthapuram', 'Tiruchirappalli', 'Tirupati',
  'Udaipur', 'Ujjain', 'Vadodara', 'Varanasi', 'Vasai', 'Vijayawada',
  'Visakhapatnam', 'Warangal', 'Yamunanagar'
];

export const getCitySuggestions = (query) => {
  if (!query || query.length < 2) return [];
  
  return indianCities
    .filter(city => 
      city.toLowerCase().startsWith(query.toLowerCase())
    )
    .slice(0, 8); // Limit to 8 suggestions
};
