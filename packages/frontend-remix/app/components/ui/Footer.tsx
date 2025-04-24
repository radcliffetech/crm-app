

export function Footer() {
  return (
    <footer className="w-full py-4 text-center text-sm text-gray-500 border-t mt-8">
      © {new Date().getFullYear()} Massachusetts Institute for Integrated Metaphysics
        <br />
        Coded by <a href="https://jeffreyradcliffe.com" className="text-blue-600 hover:underline">Jeffrey Radcliffe</a>

    </footer>
  );
}