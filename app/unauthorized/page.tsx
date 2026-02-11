import Link from 'next/link';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-4">
              Access Denied
            </h2>
            <div className="text-6xl mb-6">🚫</div>
            <p className="text-lg text-gray-600 mb-6">
              You don't have permission to access this page.
            </p>
            <p className="text-sm text-gray-500 mb-8">
              Please contact an administrator if you believe this is an error.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="w-full sm:w-auto bg-indigo-600 text-white hover:bg-indigo-700 px-6 py-3 rounded-md text-center font-medium"
              >
                Go to Home
              </Link>
              <Link
                href="/dashboard"
                className="w-full sm:w-auto bg-gray-600 text-white hover:bg-gray-700 px-6 py-3 rounded-md text-center font-medium"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}