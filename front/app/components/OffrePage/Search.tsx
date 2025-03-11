export default function Search() {
    return (
      <div className="flex flex-col divide-y-4 divide-y-reverse divide-gray-200">
        <div>
          <form className="max-w-md mx-auto shadow-xl rounded-3xl mt-20">
            <label className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">
              Search
            </label>
            <div className="relative">
              <input
                type="search"
                id="default-search"
                className="w-full p-4 pr-36 text-sm text-gray-900 border border-gray-300 rounded-3xl bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Recherche rapide de terres, équipements ou vendeurs"
                required
              />
              <button
                type="submit"
                className="absolute end-1.5 bottom-1.5 inline-flex items-center py-2.5 px-3 ms-2 text-sm font-medium text-white bg-green-700 rounded-3xl border border-green-700 hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-blue-700 dark:focus:ring-green-800"
              >
                <svg
                  className="w-4 h-4 me-2"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                  />
                </svg>
                Rechercher
              </button>
            </div>
          </form>
        </div>
        <div className="mt-20 "></div>
      </div>
    );
  }
  