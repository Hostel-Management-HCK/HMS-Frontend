async function makeRequest(method, url, token, headers = {}, body = null) {
    const defaultHeaders = {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Add more default headers if needed
    };

    const requestOptions = {
        method: method.toUpperCase(),
        headers: {
            ...defaultHeaders,
            ...headers
        },
        body: body ? JSON.stringify(body) : null
    };

    if (token != "") {
        requestOptions.headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, requestOptions);

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error:', error);
        return {error:error,message:"Error fetching the data ",error};
    }
}