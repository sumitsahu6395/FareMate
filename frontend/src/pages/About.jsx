import autoImage from "../assets/auto-rickshaw.png";

import {
  Flag,
  Compass,
  Scale,
  Users,
  Eye,
  Search,
} from "lucide-react";

function About() {
  return (
    <div className="bg-slate-50">

      {/* Hero */}
      <section className="relative bg-slate-900 py-20 px-4 sm:px-6 lg:px-8 text-center text-white overflow-hidden">

        <img
            src={autoImage}
            alt="Indian Street Auto Rickshaws Transit"
            className="w-full h-[420px] sm:h-[480px] object-cover"
        />

        <div className="relative z-10 max-w-3xl mx-auto space-y-4">

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            Making Local Transportation More Transparent
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed">
            FareMate helps passengers understand approximate local auto
            and e-rickshaw fares before starting their journey.
          </p>

        </div>
      </section>


      {/* Information Cards */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Mission */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">

            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Flag className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Our Mission
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              To bring transparency and fairness to local urban mobility
              across all Indian towns and metro hubs.
            </p>

          </div>


          {/* How FareMate Works */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">

            <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
              <Compass className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              How FareMate Works
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Using community-sourced data and verified route information
              to provide accurate real-time fare estimates.
            </p>

          </div>


          {/* Why Fare Transparency */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3 md:col-span-2">

            <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Why Fare Transparency Matters
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed max-w-2xl">
              Empowers daily passengers, reduces negotiation friction with
              auto drivers, and ensures fair earnings and trust for drivers.
            </p>

          </div>


          {/* Community */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">

            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Community Powered Data
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Every fare report shared by our users strengthens the
              accuracy of our estimates for everyone in the city.
            </p>

          </div>


          {/* Future Vision */}
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-3">

            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
              <Eye className="w-5 h-5" />
            </div>

            <h3 className="text-lg font-bold text-slate-900">
              Future Vision
            </h3>

            <p className="text-sm text-slate-600 leading-relaxed">
              Expanding to more cities and integrating more diverse local
              transport modes including mini-buses and cabs.
            </p>

          </div>

        </div>
      </section>


      {/* Stats */}
      <section className="bg-blue-50/70 border-y border-blue-100 py-12">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">

            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
              <div className="text-4xl font-extrabold text-blue-600">
                80+
              </div>

              <div className="text-sm font-bold text-slate-700 mt-1">
                Routes Covered
              </div>
            </div>


            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
              <div className="text-4xl font-extrabold text-blue-600">
                Community
              </div>

              <div className="text-sm font-bold text-slate-700 mt-1">
                Fare Reports
              </div>
            </div>


            <div className="bg-white p-6 rounded-2xl border border-blue-100 shadow-sm">
              <div className="text-4xl font-extrabold text-blue-600">
                Lucknow
              </div>

              <div className="text-sm font-bold text-slate-700 mt-1">
                Current Coverage
              </div>
            </div>

          </div>

        </div>
      </section>


      {/* CTA */}
      <section className="py-16 text-center space-y-6">

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Know Your Fare Before You Ride
        </h2>

        <div>

          <button
            onClick={() => {
              window.location.href = "/routes";
            }}
            className="px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-blue-600/20 inline-flex items-center space-x-2 transition-all"
          >
            <Search className="w-4 h-4" />
            <span>Search Fare</span>
          </button>

        </div>

      </section>

    </div>
  );
}

export default About;