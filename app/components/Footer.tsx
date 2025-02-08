export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-800">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <div className="grid grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-bold mb-4">Marketplace</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/models"
                  className="text-gray-400 hover:text-white transition"
                >
                  Browse Models
                </a>
              </li>
              <li>
                <a
                  href="/materials"
                  className="text-gray-400 hover:text-white transition"
                >
                  Materials
                </a>
              </li>
              <li>
                <a
                  href="/scenes"
                  className="text-gray-400 hover:text-white transition"
                >
                  Scenes
                </a>
              </li>
              <li>
                <a
                  href="/creators"
                  className="text-gray-400 hover:text-white transition"
                >
                  Creators
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/docs"
                  className="text-gray-400 hover:text-white transition"
                >
                  Documentation
                </a>
              </li>
              <li>
                <a
                  href="/tutorials"
                  className="text-gray-400 hover:text-white transition"
                >
                  Tutorials
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="text-gray-400 hover:text-white transition"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="text-gray-400 hover:text-white transition"
                >
                  Support
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/terms"
                  className="text-gray-400 hover:text-white transition"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="text-gray-400 hover:text-white transition"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="/licensing"
                  className="text-gray-400 hover:text-white transition"
                >
                  Licensing
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-4">Connect</h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://twitter.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  Twitter
                </a>
              </li>
              <li>
                <a
                  href="https://discord.gg"
                  className="text-gray-400 hover:text-white transition"
                >
                  Discord
                </a>
              </li>
              <li>
                <a
                  href="https://github.com"
                  className="text-gray-400 hover:text-white transition"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-gray-800">
          <p className="text-center text-gray-400">
            © 2024 3D Model Marketplace. Powered by Story Protocol.
          </p>
        </div>
      </div>
    </footer>
  );
}
