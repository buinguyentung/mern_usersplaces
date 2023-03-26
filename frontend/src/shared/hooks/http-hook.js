import { useCallback, useEffect, useRef, useState } from 'react';

const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // Store active http requests
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', headers = {}, body = null) => {
      setIsLoading(true);
      // Push abort controller to remove later
      const httpAbortCtrl = new AbortController();
      activeHttpRequests.current.push(httpAbortCtrl);

      try {
        const response = await fetch(url, {
          method,
          headers,
          body,
          signal: httpAbortCtrl.signal,
        });

        const responseData = await response.json();

        // Remove active http request when completed
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqCtl) => reqCtl !== httpAbortCtrl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }
        // console.log(responseData);
        setIsLoading(false);
        return responseData;
      } catch (error) {
        setIsLoading(false);
        console.log('[ERROR] ' + error);
        setError(error.message || 'Something went wrong.');
        throw error;
      }
    },
    []
  );

  // Remove active http requests when component unmounts
  useEffect(() => {
    return () => {
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
  }, []);

  // Clear any error
  const clearError = () => {
    setError(null);
  };

  return { isLoading, error, sendRequest, clearError };
};

export default useHttpClient;
