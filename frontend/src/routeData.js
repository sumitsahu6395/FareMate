export const routes = [
  {
    id: "1",
    pickup: "Charbagh",
    destination: "Hazratganj",
    distanceKm: 5,
    timeMins: 15,
    minFare: 15,
    maxFare: 20,
    vehicleType: "Shared Auto",
    isVerified: true,
    isPopular: true,
    pricingType: "Per Seat",
    updatedText: "Updated recently",

    pickupDetail: "Charbagh Metro / Main Stand",
    destinationDetail: "Hazratganj Main Stop",

    alternativeOptions: [
      {
        vehicleType: "E-Rickshaw",
        fare: "₹20",
        timeMins: 18,
        pricingType: "Per Seat",
      },
      {
        vehicleType: "Private Auto",
        fare: "₹80-100",
        timeMins: 12,
        pricingType: "Negotiable",
      },
    ],
  },

  {
    id: "2",
    pickup: "Polytechnic",
    destination: "Engineering College",
    distanceKm: 3.5,
    timeMins: 12,
    minFare: 10,
    maxFare: 15,
    vehicleType: "Shared Auto",
    isVerified: true,
    isPopular: true,
    pricingType: "Per Seat",
    updatedText: "Updated recently",

    pickupDetail: "Polytechnic Chauraha",
    destinationDetail: "Engineering College Gate",

    alternativeOptions: [
      {
        vehicleType: "E-Rickshaw",
        fare: "₹15-20",
        timeMins: 15,
        pricingType: "Per Seat",
      },
    ],
  },

  {
    id: "3",
    pickup: "BBD",
    destination: "Kamta",
    distanceKm: 6,
    timeMins: 20,
    minFare: 10,
    maxFare: 20,
    vehicleType: "E-Rickshaw",
    isVerified: true,
    isPopular: true,
    pricingType: "Negotiable",
    updatedText: "Updated recently",

    pickupDetail: "BBD University Gate",
    destinationDetail: "Kamta Chauraha",

    alternativeOptions: [
      {
        vehicleType: "Shared Auto",
        fare: "₹15-20",
        timeMins: 20,
        pricingType: "Per Seat",
      },
    ],
  },

  {
    id: "4",
    pickup: "Hazratganj",
    destination: "Aliganj",
    distanceKm: 7,
    timeMins: 25,
    minFare: 20,
    maxFare: 25,
    vehicleType: "Shared Auto",
    isVerified: true,
    isPopular: false,
    pricingType: "Per Seat",
    updatedText: "Updated recently",

    pickupDetail: "Hazratganj Main Stop",
    destinationDetail: "Aliganj Main Road",

    alternativeOptions: [],
  },

  {
    id: "5",
    pickup: "Charbagh",
    destination: "Alambagh",
    distanceKm: 6,
    timeMins: 20,
    minFare: 15,
    maxFare: 20,
    vehicleType: "E-Rickshaw",
    isVerified: true,
    isPopular: false,
    pricingType: "Per Seat",
    updatedText: "Updated recently",

    pickupDetail: "Charbagh Main Stand",
    destinationDetail: "Alambagh Bus Stand",

    alternativeOptions: [],
  },

  {
    id: "6",
    pickup: "Gomti Nagar",
    destination: "Hazratganj",
    distanceKm: 8,
    timeMins: 25,
    minFare: 20,
    maxFare: 30,
    vehicleType: "Private Auto",
    isVerified: false,
    isPopular: false,
    pricingType: "Negotiable",
    updatedText: "Updated recently",

    pickupDetail: "Gomti Nagar",
    destinationDetail: "Hazratganj",

    alternativeOptions: [],
  },
];