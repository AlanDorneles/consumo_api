// apiWorker.js

onmessage = function (e) {
    const { apiUrl } = e.data;
  
    fetch(apiUrl)
      .then((response) => response.json())
      .then((result) => {
        postMessage(result);
      })
      .catch((error) => {
        postMessage({ error: error.message });
      });
  };
  