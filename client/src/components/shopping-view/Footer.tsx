import React from "react";
import { FaInstagram, FaFacebookF, FaTwitter } from "react-icons/fa";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-gray-300 text-sm">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Contact */}
        <div>
          <h3 className="font-semibold mb-3">Contact</h3>
          <p>01234 567 890</p>
          <p>Info@loremipsum.co.uk</p>
        </div>

        {/* Shop */}
        <div>
          <h3 className="font-semibold mb-3">Shop</h3>
          <ul className="space-y-2">
            <li>Tops</li>
            <li>Bottoms</li>
            <li>Outerwear</li>
            <li>New In</li>
            <li>About</li>
            <li>Blog</li>
            <li>Contact</li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-semibold mb-3">Company</h3>
          <ul className="space-y-2">
            <li>Cookies</li>
            <li>Payments</li>
            <li>Terms &amp; Conditions</li>
            <li>Privacy Policy</li>
            <li>Security</li>
          </ul>
        </div>

        {/* Newsletter */}
        <div>
          <h3 className="font-semibold mb-3">Newsletter</h3>
          <p className="mb-3">Be the first to hear about our latest offers</p>
          <div className="flex items-center border border-gray-600">
            <input
              type="email"
              placeholder="YOUR EMAIL ADDRESS"
              className="bg-transparent px-3 py-2 w-full text-gray-300 placeholder-gray-400 focus:outline-none"
            />
            <button className="px-3 py-2 bg-transparent text-gray-300 hover:text-white">
              →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-700 mt-6">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between text-xs text-gray-400">
          <p>Copyright © 2018 Lorem Ipsum Ltd</p>
          <div className="flex space-x-5 mt-3 md:mt-0">
            <a href="#" className="hover:text-white">
              <FaInstagram />
            </a>
            <a href="#" className="hover:text-white">
              <FaFacebookF />
            </a>
            <a href="#" className="hover:text-white">
              <FaTwitter />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

