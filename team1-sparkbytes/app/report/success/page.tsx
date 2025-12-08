export default function SuccessPage() {
  return (
    <main className="min-h-screen flex flex-col justify-center items-center bg-[#FFF8F5] px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-3">
          Report Submitted!
        </h1>
        <p className="text-gray-700 mb-6">
          Thank you for helping us improve SparkBytes. We appreciate your feedback!
        </p>

        <a
          href="/event"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
        >
          Return to Home
        </a>
      </div>
    </main>
  );
}
