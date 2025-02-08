export default function Footer() {
    return (
      <footer className="px-6 py-16 bg-gray-800 text-white text-center">
        <div className="mb-4">
          <img src="path/to/logo.png" className="h-16" alt="Logo" />
        </div>
        <p>© 2023 StoryForge. All rights reserved.</p>
        <div className="mt-4">
          {/* <Link href="/privacy" className="text-gray-400 hover:text-white">Privacy Policy</Link> */}
          <span className="mx-2">|</span>
          {/* <Link href="/terms" className="text-gray-400 hover:text-white">Terms of Service</Link> */}
        </div>
      </footer>
    );
  }