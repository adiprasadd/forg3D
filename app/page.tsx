import Navigation from "./components/Navigation";

export default function Home() {
  return (
    <main>
      <Navigation />
      <div className="px-6 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
            The World's IP Blockchain
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Transform intelligence into Programmable IP assets. Trade IP in a
            global market for AI training and remixing.
          </p>
          <div className="flex gap-4 justify-center">
            <button className="px-6 py-3 bg-blue-500 rounded-lg hover:bg-blue-600 transition">
              Launch App
            </button>
            <button className="px-6 py-3 border border-blue-500 rounded-lg hover:bg-blue-500/10 transition">
              Learn More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
