import axios from "axios";

export const getNearbyHospitals = async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: "Location required" });
    }

    const GOOGLE_PLACES_API_KEY = process.env.GOOGLE_PLACES_API_KEY; 
    const radius = 5000; 
    const type = "hospital"; 

    const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=${radius}&type=${type}&key=${GOOGLE_PLACES_API_KEY}`;

    const response = await axios.get(url);

    const hospitals = response.data.results.map((hospital) => ({
      name: hospital.name,
      address: hospital.vicinity,
      rating: hospital.rating || "No rating",
      placeId: hospital.place_id,
      latitude: hospital.geometry.location.lat, 
      longitude: hospital.geometry.location.lng, 
    }));

    return res.status(200).json({ success: true, hospitals });

  } catch (error) {
    console.error("Error fetching hospitals:", error);
    return res.status(500).json({ success: false, message: "Error fetching hospitals" });
  }
};
