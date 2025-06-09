import React from "react";
import { motion } from "framer-motion";

const FarmerDetails = () => {
  const tamilNaduFarmers = [
    {
      name: "Ramesh Kumar",
      location: "Chennai",
      rating: "4.8",
      experience: "15 years",
      products: ["Tomatoes", "Potatoes", "Onions"],
      img: "/images/farmer1.jpeg",
      phoneNumber: "9876543210", // Add phone number
    },
    {
      name: "Lakshmi Farms",
      location: "Coimbatore",
      rating: "4.6",
      experience: "10 years",
      products: ["Carrots", "Beans", "Cabbage"],
      img: "/images/farmer2.jpeg",
      phoneNumber: "9876543211", // Add phone number
    },
    {
      name: "Green Harvest",
      location: "Salem",
      rating: "4.9",
      experience: "20 years",
      products: ["Rice", "Wheat", "Pulses"],
      img: "/images/farmer3.jpeg",
      phoneNumber: "9876543212", // Add phone number
    },
    {
      name: "Thirumurugan",
      location: "Madurai",
      rating: "4.7",
      experience: "12 years",
      products: ["Mangoes", "Bananas", "Papayas"],
      img: "/images/farmer4.jpeg",
      phoneNumber: "9876543213", // Add phone number
    },
    {
      name: "Valli Organics",
      location: "Erode",
      rating: "4.5",
      experience: "8 years",
      products: ["Turmeric", "Millets", "Groundnuts"],
      img: "/images/farmer5.jpg",
      phoneNumber: "9876543214", // Add phone number
    },
    {
      name: "AgriRoots Farm",
      location: "Thanjavur",
      rating: "4.9",
      experience: "18 years",
      products: ["Sugarcane", "Coconut", "Maize"],
      img: "/images/farmer6.jpeg",
      phoneNumber: "9876543215", // Add phone number
    },
  ];

  const newsItems = [
    {
      title: "Organic Farming Trends in Salem",
      image: "/images/news1.jpg",
      desc: "Farmers are adopting eco-friendly techniques for better yield and sustainability.",
    },
    {
      title: "Subsidies for Drip Irrigation",
      image: "/images/news2.jpg",
      desc: "Tamil Nadu govt announces 50% subsidy for drip irrigation systems.",
    },
    {
      title: "Pest Control Awareness Camp",
      image: "/images/news3.jpg",
      desc: "AgroTech Nexus organizes free pest control training in Thanjavur region.",
    },
  ];

  return (
    <div className="bg-green-50 text-gray-800">
      {/* 1. Farmer Definition */}
      <section className="py-12 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            src="https://img.freepik.com/free-photo/farmer-holds-rice-hand_1150-6063.jpg?ga=GA1.1.1032194566.1745092601&semt=ais_hybrid&w=740"
            alt="Farmer"
            className="rounded-2xl shadow-xl"
            whileHover={{ scale: 1.05 }}
          />
          <div>
            <h2 className="text-4xl font-bold mb-4 text-green-700">
              Who is a Farmer?
            </h2>
            <p className="text-lg leading-relaxed">
              A farmer is someone engaged in agriculture, producing crops and
              raising animals to sustain their family and community. Farmers are
              the foundation of the food chain, and they work tirelessly across
              all seasons to ensure food security.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Our Farmers in Tamil Nadu */}
      <section className="py-12 px-6 md:px-20 bg-green-100">
        <h2 className="text-3xl font-bold text-center text-green-800 mb-10">
          Our Farmers in Tamil Nadu
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {tamilNaduFarmers.map((farmer, index) => (
            <motion.div
              key={index}
              className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg border"
              whileHover={{ scale: 1.03 }}
            >
              <img
                src={farmer.img}
                alt={farmer.name}
                className="rounded-lg h-40 w-full object-cover mb-4"
              />
              <h3 className="text-xl font-bold">{farmer.name}</h3>
              <p className="text-sm">
                Location: <span className="font-medium">{farmer.location}</span>
              </p>
              <p className="text-sm">Rating: ⭐ {farmer.rating}</p>
              <p className="text-sm">Experience: {farmer.experience}</p>
              <p className="text-sm mb-2">Products:</p>
              <div className="flex flex-wrap gap-2">
                {farmer.products.map((product, i) => (
                  <span
                    key={i}
                    className="bg-green-200 text-sm px-2 py-1 rounded-full"
                  >
                    {product}
                  </span>
                ))}
              </div>
              <div className="flex justify-between mt-4">
                <button className="bg-green-600 text-white px-4 py-1 rounded-md">
                  <a
                    href={`tel:+91${farmer.phoneNumber}`}
                    className="text-white"
                  >
                    📞 Call
                  </a>
                </button>
                <button className="border px-4 py-1 rounded-md">
                  <a
                    href={`https://wa.me/${farmer.phoneNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-green-700"
                  >
                    💬 Message
                  </a>
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 3. Support Section */}
      <section className="py-12 px-6 md:px-20 bg-white">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            src="/images/support1.jpg"
            alt="Farmer Support"
            className="rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          />
          <div>
            <h2 className="text-3xl font-bold text-green-700 mb-4">
              Support for Our Farmers
            </h2>
            <p className="text-lg leading-relaxed">
              We provide agritech tools, expert guidance, timely weather
              updates, and 24/7 customer service to ensure our farmers get all
              the support they need to thrive and improve yield.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Communication Section */}
      <section className="py-12 px-6 md:px-20 bg-green-100">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Communication & Teamwork
            </h2>
            <p className="text-lg leading-relaxed">
              Our farmer network stays connected through real-time chat groups,
              virtual meetups, and localized WhatsApp communities. We also
              facilitate expert Q&A sessions and crop-specific forums.
            </p>
          </div>
          <motion.img
            src="/images/teamwork.jpg"
            alt="Communication"
            className="rounded-xl shadow-lg"
            whileHover={{ scale: 1.05 }}
          />
        </div>
      </section>

      {/* 5. News Section */}
      <section className="py-12 px-6 md:px-20 bg-white">
        <h2 className="text-3xl font-bold text-center text-green-700 mb-6">
          Latest News for Tamil Nadu Farmers
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {newsItems.map((news, i) => (
            <motion.div
              key={i}
              className="bg-green-50 rounded-xl p-4 shadow hover:shadow-md"
              whileHover={{ scale: 1.02 }}
            >
              <img
                src={news.image}
                alt={news.title}
                className="h-40 w-full object-cover rounded-md mb-3"
              />
              <h4 className="text-lg font-semibold text-green-700 mb-1">
                {news.title}
              </h4>
              <p className="text-sm">{news.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 6. CTA Join Section */}
      <section className="py-12 px-6 md:px-20 bg-green-700 text-white text-center">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <motion.img
            src="/images/joinourteam.jpg"
            alt="Join As Farmer"
            className="rounded-xl shadow-xl"
            whileHover={{ scale: 1.05 }}
          />
          <div>
            <h2 className="text-3xl font-bold mb-4">
              Join Our Farmer Community
            </h2>
            <p className="text-lg mb-6">
              Are you a farmer in Tamil Nadu? Register today to showcase your
              produce, connect with buyers, and access tools to grow your
              business.
            </p>
            <a
              href="/register"
              className="inline-block bg-white text-green-700 font-semibold px-6 py-3 rounded-xl shadow hover:bg-green-100 transition"
            >
              🌱 Join Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default FarmerDetails;
