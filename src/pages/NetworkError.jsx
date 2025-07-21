function NetworkError() {
  return (
    <main className="grid h-dvh place-items-center bg-(--dark) px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-base font-semibold text-red-500">500</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-neutral-300 sm:text-7xl">
          Oops! Something went wrong.
        </h1>
        <p className="mt-6 text-lg text-gray-400 sm:text-xl">
          We couldn’t connect to the server. Please check your internet
          connection, disable any blocking extensions, or try again in a few
          moments.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Retry
          </a>
        </div>
      </div>
    </main>
  );
}

export default NetworkError;
