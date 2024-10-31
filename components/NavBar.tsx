import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="bg-gradient-to-r from-blue-800 to-blue-400 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link legacyBehavior href="/">
          <h1 className="text-3xl font-bold text-white cursor-pointer">
            Evently
          </h1>
        </Link>
        <div className="flex space-x-6">
          <Link legacyBehavior href="/admin">
            <span className="text-white hover:text-gray-200 text-lg cursor-pointer">
              Admin
            </span>
          </Link>
          <Link legacyBehavior href="/login">
            <span className="text-white hover:text-gray-200 text-lg cursor-pointer">
              Login
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
