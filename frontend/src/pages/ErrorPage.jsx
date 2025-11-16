const ErrorPage = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100 px-4">
      <div className="bg-white p-8 md:p-10 rounded-xl shadow-lg text-center w-full max-w-md">
        <h1 className="text-gray-800 text-5xl font-bold mb-4">404</h1>
        <p className="text-gray-600 text-xl mb-6">Page Not Found</p>
      </div>
    </div>
  );
};

export default ErrorPage;
