import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-gray-300 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link legacyBehavior href="/">
          <h1 className="text-3xl font-bold text-orange-500 cursor-pointer">
            Evently
          </h1>
        </Link>
        <div className="flex space-x-6 items-center">
          <Link legacyBehavior href="/admin">
            <span className="text-gray-700 text-lg font-semibold cursor-pointer">
              Admin
            </span>
          </Link>
          <Link legacyBehavior href="/login">
            <span className="bg-orange-500 text-white py-2 px-4 rounded-lg text-lg font-semibold hover:bg-orange-600 cursor-pointer">
              Login
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
