import { Link } from "react-router-dom";
import { Shield } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Main Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand Info */}
          <div className="md:col-span-1">

            <Link
              to="/"
              className="inline-flex items-center space-x-2 mb-4"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Shield className="w-5 h-5" />
              </div>

              <span className="text-xl font-extrabold text-white">
                FareMate
              </span>
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Ensuring transparency in every ride across India.
              Stop guessing, start verifying your local commutes
              for Shared Autos, E-Rickshaws, and local transit.
            </p>

            <p className="mt-6 text-xs text-slate-500">
              © {new Date().getFullYear()} FareMate India.
              All rights reserved.
            </p>

          </div>


          {/* Navigation Links */}
          <div>

            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Navigation
            </h4>

            <ul className="space-y-2.5 text-sm">

              <li>
                <Link
                  to="/"
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>

              <li>
                <Link
                  to="/routes"
                  className="hover:text-blue-400 transition-colors"
                >
                  Routes
                </Link>
              </li>

              <li>
                <Link
                  to="/report-fare"
                  className="hover:text-blue-400 transition-colors"
                >
                  Report Fare
                </Link>
              </li>

              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About FareMate
                </Link>
              </li>

            </ul>

          </div>


          {/* Company Links */}
          <div>

            <h4 className="text-xs font-semibold text-slate-200 uppercase tracking-wider mb-4">
              Company
            </h4>

            <ul className="space-y-2.5 text-sm text-slate-400">

              <li>
                <Link
                  to="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>

              <li>
                <Link
                  to="/login"
                  className="hover:text-blue-400 transition-colors"
                >
                  Login / Account
                </Link>
              </li>

              <li>
                <a
                  href="#privacy"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>

              <li>
                <a
                  href="#terms"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </a>
              </li>

              <li>
                <a
                  href="#support"
                  onClick={(e) => e.preventDefault()}
                  className="hover:text-blue-400 transition-colors"
                >
                  Help & Support
                </a>
              </li>

            </ul>

          </div>

        </div>


        {/* Bottom Section */}
        <div className="pt-8 mt-10 border-t border-slate-800 text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p className="max-w-3xl text-center sm:text-left">
            Disclaimer: Fares are estimates based on crowd-sourced
            community input and may vary depending on traffic, time
            of day, and local negotiation.
          </p>

          <div className="flex space-x-6">

            <a
              href="#privacy"
              onClick={(e) => e.preventDefault()}
              className="hover:text-slate-300"
            >
              Privacy
            </a>

            <a
              href="#terms"
              onClick={(e) => e.preventDefault()}
              className="hover:text-slate-300"
            >
              Terms
            </a>

            <a
              href="#contact"
              onClick={(e) => e.preventDefault()}
              className="hover:text-slate-300"
            >
              Contact Us
            </a>

          </div>

        </div>

      </div>
    </footer>
  );
}

export default Footer;