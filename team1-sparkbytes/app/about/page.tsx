import AboutClient from "./about-client";

export const metadata = {
  title: "About SparkBytes",
  description: "Learn more about the SparkBytes platform at Boston University.",
};

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen bg-white text-gray-900">
      <section className="flex flex-col items-center text-center py-16 px-6 bg-gradient-to-b from-red-600 to-red-700 text-white">
        <h1 className="text-4xl font-bold mb-4">Welcome to SparkBytes 🍽️</h1>
        <p className="max-w-2xl text-lg leading-relaxed">
          SparkBytes connects Boston University students to share leftover food from campus events —
          reducing waste and fostering community, one meal at a time.
        </p>
      </section>

      <section className="max-w-5xl mx-auto py-16 px-6 text-center">
        <h2 className="text-3xl font-bold text-red-700 mb-4">About SparkBytes</h2>
        <p className="text-lg text-gray-700 leading-relaxed mb-10">
          Built by BU students for BU students, SparkBytes helps the community discover
          real-time food sharing events on campus. We aim to reduce food waste while
          connecting people over shared meals.
        </p>

        <div className="grid sm:grid-cols-3 gap-8 mt-6">
          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-red-700 mb-2">💡 Mission</h3>
            <p className="text-sm text-gray-600">
              Promote sustainability by ensuring leftover event food reaches hungry students
              instead of landfills.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-red-700 mb-2">👥 Team</h3>
            <p className="text-sm text-gray-600">
              A passionate group of BU students combining tech and social impact to make
              campus life greener and friendlier.
            </p>
          </div>
          <div className="p-6 bg-gray-50 rounded-2xl shadow-sm">
            <h3 className="font-semibold text-red-700 mb-2">📈 Impact</h3>
            <p className="text-sm text-gray-600">
              Hundreds of meals have been shared and saved through SparkBytes events.
              Every bite counts toward a more sustainable campus.
            </p>
          </div>
        </div>
      </section>

      <AboutClient />
    </main>
  );
}
