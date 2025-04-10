

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 text-gray-800 px-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl mb-2">Page Not Found</p>
      <p className="text-gray-600 mb-6 text-center max-w-md">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/"
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Go Home
      </a>
    </div>
  )
}

export default NotFound
