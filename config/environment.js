const environment = {
    apiUrl: import.meta.env.VITE_APP_API_URL, // Computed values based on environment variables
    get baseUrl() {
        return this.apiUrl;
    },

    // Helper method to get full API URL
    getApiUrl(endpoint) {
        return this.baseUrl + `/${endpoint}`;
    }
};

export default environment;