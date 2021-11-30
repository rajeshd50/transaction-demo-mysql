module.exports = {
  responseSuccess: (data, message, status) => {
    return {
      data, message: message || 'success', status: status || 200, success: true
    }
  },
  responseError: (data, message, status) => {
    return {
      data, message: message || 'error', status: status || 500, success: false
    }
  }
}