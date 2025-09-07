 class ApiResponse {
    constructor(statusCode, data, message = "Success") {
        this.statusCode = statusCode
        this.message = message
        this.data = data
        this.success = statusCode < 400 // should be less than 400 because anything above it will send through the error response
    }
}
