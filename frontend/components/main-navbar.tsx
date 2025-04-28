import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { href: "/dev-forum", label: "Home" },
  { href: "/dev-forum/blog", label: "Blogs" },
  { href: "/dev-forum/me", label: "My Profile" },
  { href: "/dev-forum/about", label: "About" },
  // Add more links as needed
];

export function MainNavbar() {
  const pathname = usePathname();
  return (
    <nav className="w-full bg-blue-950 text-white shadow flex items-center px-6 py-3 gap-4">
      <span className="font-bold text-xl mr-8">Nexa Learn</span>
      <div className="flex gap-4">
        {navLinks.map(link => (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1 rounded hover:bg-blue-800 transition-colors font-medium ${pathname === link.href ? "bg-blue-800 text-yellow-300" : "text-white"}`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
