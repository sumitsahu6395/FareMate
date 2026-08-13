import { useState } from "react";
import {
  Send,
  MapPin,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

function ReportFare() {
  const [pickup, setPickup] = useState("");
  const [destination, setDestination] = useState("");
  const [vehicleType, setVehicleType] = useState("Shared Auto");
  const [farePaid, setFarePaid] = useState("");
  const [travelDate, setTravelDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [distance, setDistance] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!pickup || !destination || !farePaid) {
    alert(
      "Please fill out all required fields: Pickup, Destination, and Fare Paid."
    );
    return;
  }

  try {
            const response = await fetch("http://localhost:5000/api/reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pickup,
          destination,
          vehicleType,
          farePaid: Number(farePaid),
          travelDate,
          distance: distance ? `${distance} km` : "Not specified",
          notes,
        }),

    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to submit fare");
    }

    console.log("Route added successfully:", data);

    setSubmitted(true);
  } catch (error) {
    console.error("Submit fare error:", error);

    alert("Failed to submit fare. Please try again.");
  }
};

    
  if (submitted) {
    return (
      <div className="min-h-screen bg-slate-50 py-16 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xl text-center space-y-6">

          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">
              Thank You for Contributing!
            </h2>

            <p className="text-sm text-slate-500">
              Your fare report for{" "}
              <span className="font-semibold text-slate-800">
                {pickup} → {destination}
              </span>{" "}
              has been submitted for community verification.
            </p>
          </div>

          <button
            onClick={() => {
              setSubmitted(false);
              setFarePaid("");
              setNotes("");
            }}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl transition-colors shadow-sm"
          >
            Submit Another Fare
          </button>

        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12">

      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">

          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
            Help Improve Fare Transparency
          </h1>

          <p className="text-slate-500 text-sm max-w-lg mx-auto">
            Share the fare you recently paid and help other passengers
            navigate the city with confidence.
          </p>

        </div>


        {/* Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6">

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Pickup */}
            <div>

              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Pickup Location{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <div className="w-3.5 h-3.5 rounded-full border-2 border-slate-400" />
                </div>

                <input
                  type="text"
                  required
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="e.g. Charbagh"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />

              </div>
            </div>


            {/* Destination */}
            <div>

              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Destination{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="relative">

                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin className="w-4 h-4 text-blue-600" />
                </div>

                <input
                  type="text"
                  required
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="e.g. Hazratganj"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />

              </div>
            </div>


            {/* Vehicle Type */}
            <div>

              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Vehicle Type{" "}
                <span className="text-red-500">*</span>
              </label>

              <div className="grid grid-cols-3 bg-slate-100 p-1 rounded-xl gap-1">

                {[
                  "Shared Auto",
                  "E-Rickshaw",
                  "Private Auto",
                ].map((vehicle) => (

                  <button
                    key={vehicle}
                    type="button"
                    onClick={() => setVehicleType(vehicle)}
                    className={`py-2.5 text-xs font-semibold rounded-lg transition-all ${
                      vehicleType === vehicle
                        ? "bg-white text-blue-700 shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {vehicle === "Private Auto" ? "Auto" : vehicle}
                  </button>

                ))}

              </div>

            </div>


            {/* Fare + Date */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              {/* Fare */}
              <div>

                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Fare Paid{" "}
                  <span className="text-red-500">*</span>
                </label>

                <div className="relative">

                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-600 font-bold text-sm">
                    ₹
                  </div>

                  <input
                    type="number"
                    required
                    min="1"
                    value={farePaid}
                    onChange={(e) => setFarePaid(e.target.value)}
                    placeholder="0"
                    className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                  />

                </div>

              </div>


              {/* Date */}
              <div>

                <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                  Date of Travel{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  type="date"
                  required
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />

              </div>

            </div>


            {/* Distance */}
            <div>

              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Estimated Distance{" "}
                <span className="font-normal normal-case text-slate-400">
                  (Optional)
                </span>
              </label>

              <div className="relative">

                <input
                  type="number"
                  step="0.1"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  placeholder="e.g. 5"
                  className="w-full pr-12 pl-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
                />

                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-xs font-bold text-slate-400">
                  km
                </div>

              </div>

            </div>


            {/* Notes */}
            <div>

              <label className="block text-xs font-bold uppercase text-slate-700 mb-1.5">
                Additional Notes{" "}
                <span className="font-normal normal-case text-slate-400">
                  (Optional)
                </span>
              </label>

              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any details about the route, negotiation, or surge pricing..."
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
              />

            </div>


            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 flex items-center justify-center space-x-2 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Fare</span>
            </button>

          </form>


          {/* Security Message */}
          <div className="pt-2 text-center flex items-center justify-center space-x-1.5 text-xs text-slate-500 font-medium">

            <ShieldCheck className="w-4 h-4 text-emerald-600" />

            <span>
              Your report helps verify localized fare estimates.
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

export default ReportFare;