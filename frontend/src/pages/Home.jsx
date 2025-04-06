// frontend/src/pages/Home.jsx
import React, { useRef } from 'react';
import Typewriter from 'typewriter-effect';

const Home = () => {
  // Create a ref for the "What We Offer" section
  const offersSectionRef = useRef(null);

  // Function to scroll to the "What We Offer" section
  const scrollToOffers = () => {
    offersSectionRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  // Feature cards data
  const features = [
    {
      title: "Book Appointments",
      description: "Book appointments with specialists without leaving your home.",
      image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Find Doctors",
      description: "Search and connect with the best doctors in your area.",
      image: "https://media.istockphoto.com/id/1398828096/photo/portrait-of-a-young-indian-doctor-wearing-a-stethoscope-sitting-in-a-office-writing-a.jpg?s=612x612&w=0&k=20&c=JHRk3XilS2_pzTTcuozuVTX49I7AXuI8vN_NjHJQ04w="
    },
    {
      title: "Symptom Checker",
      description: "Get insights about your symptoms before consulting a doctor.",
      image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Health Records",
      description: "Store and access your medical records securely from anywhere.",
      image: "https://images.unsplash.com/photo-1573883431205-98b5f10aaedb?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Medication Checker",
      description: "Check for harmful interactions within your medicines.",
      image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Unfit Mapping",
      description: "Mark areas unfit for travelling during medical emergencies.",
      image: "https://betinasia.zendesk.com/hc/article_attachments/22178895521170"
    },
    {
      title: "SOS Support",
      description: "Get immediate help in case of emergencies.",
      image: "https://www.continuouscare.io/blog/wp-content/uploads/2017/02/8-common-questions-about-remote-care-and-virtual-consultations-answered.png"
    },
    {
      title: "Health Tips",
      description: "Get personalized health tips and recommendations.",
      image: "https://cdn2.momjunction.com/wp-content/uploads/2020/11/17-Simple-And-Useful-Health-Tips-For-Children-To-Follow-Banner.jpg.avif"
    }
  ];

  return (
    <div className="w-full">
      {/* Hero Section - Adjusted for navbar */}
      <section className="relative bottom-16 h-screen flex flex-col md:flex-row pt-20">
        {/* Left Side - Text with Typewriter Effect */}
        <div className="w-full md:w-1/2 flex flex-col justify-center px-8 md:px-16 py-12">
          <h1 className="text-8xl font-bold text-green-800 mb-6">
            Your Health,<br />Our Priority
          </h1>

          <div className="text-xl md:text-2xl lg:text-3xl text-blue-600 font-medium mb-2 h-20">
            <Typewriter
              options={{
                strings: [
                  'Book appointments with top doctors',
                  'Check your symptoms online',
                  'Get medical advice from specialists',
                  'Track your health records'
                ],
                autoStart: true,
                loop: true,
                delay: 50,
                deleteSpeed: 30
              }}
            />
          </div>

          <p className="text-2xl text-gray-600 mb-10 max-w-lg">
            <span className='font-semibold'>SAAHAS</span> brings healthcare to your fingertips. Access quality healthcare services anytime, anywhere.
          </p>

          {/* Learn More button */}
          <div className="flex justify-center md:justify-start">
            <button
              onClick={scrollToOffers}
              className="px-10 py-4 bg-green-700 text-white font-medium rounded-lg hover:bg-green-800 text-center text-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="w-full md:w-1/2 h-full overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&q=80"
            alt="Healthcare professionals"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <section ref={offersSectionRef} className="py-24 bg-gray-50">
        <div className="container mx-auto px-24">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">What We Offer</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Comprehensive healthcare solutions designed to make your life easier and healthier
            </p>
          </div>

          {/* First row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-2">
                <div className="h-56 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-lg text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Second row - 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-16">
            {features.slice(3, 6).map((feature, index) => (
              <div key={index + 3} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-2">
                <div className="h-56 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-lg text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Third row - 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 max-w-4xl mx-auto">
            {features.slice(6, 8).map((feature, index) => (
              <div key={index + 6} className="bg-white rounded-xl shadow-lg overflow-hidden transition-transform duration-300 hover:transform hover:-translate-y-2">
                <div className="h-56 overflow-hidden">
                  <img
                    src={feature.image}
                    alt={feature.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  <p className="text-lg text-gray-600">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="py-4 md:py-8 px-4 md:px-10 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
        <div className="w-full md:w-1/2 h-[200px] md:h-[300px] rounded-2xl overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
          <img
            src="https://img.freepik.com/free-vector/online-education-concept_52683-8287.jpg?ga=GA1.1.906515664.1738859704&semt=ais_hybrid"
            alt="Mobile app preview"
            className="w-full h-full object-contain bg-white"
          />
        </div>

        <div className="w-full md:w-1/2 space-y-4 md:space-y-6 max-w-xl text-black text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-3 md:mb-5">
            Try Our App
          </h1>
          <p className="text-lg md:text-xl text-black leading-relaxed mb-3 md:mb-5">
            We are working at full speed to bring you an exceptional mobile experience. Our app will soon be available for beta testing and on the Play Store.
          </p>
          <p className="text-xl md:text-2xl font-semibold text-red-500">
            Hang Tight! Something amazing is coming...
          </p>
        </div>
      </div>

    </div>
  );
};

export default Home;