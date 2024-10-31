import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function login() {
  return (
    <div>
      <h1 className="text-4xl text-orange-600 font-extrabold from-accent-foreground m-3">
        Evently
      </h1>
      <div className="max-w-md mx-auto mt-24 p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-orange-600 text-white font-bold py-2 rounded-md hover:bg-orange-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
