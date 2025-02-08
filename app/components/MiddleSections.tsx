export default function MiddleSections() {
    return (
      <div>
        <div className="flex px-6 py-16">
          <div className="flex-1">
            <img src="middle1.png" className="rounded-lg" alt="Description" />
          </div>
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-semibold">Section Title</h2>
            <p className="text-lg text-gray-600">Some descriptive text about this section.</p>
          </div>
        </div>
        <div className="flex px-6 py-16">
          <div className="flex-1 text-center">
            <h2 className="text-3xl font-semibold">Another Section Title</h2>
            <p className="text-lg text-gray-600">Some descriptive text about this section.</p>
          </div>
          <div className="flex-1">
            <img src="middle2.png" className="rounded-lg" alt="Description" />
          </div>
        </div>
      </div>
    );
  }