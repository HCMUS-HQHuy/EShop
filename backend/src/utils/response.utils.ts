
function successResponse(message: string, data: any[]) {
  return {
    message: message,
    error: false,
    data: data || [],
  };
}

function errorResponse(message: string, data: any[]) {
  return {
    message: message,
    error: true,
    data: data || []
  };
}

const response = {
  success: successResponse,
  error: errorResponse
};
export default response;