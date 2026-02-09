(function () {
  window.API_URL = "https://primal-workout.onrender.com/api";
  window.getToken = function () {
    return localStorage.getItem("token");
  };
  window.getAuthHeaders = function () {
    var t = window.getToken();
    return t
      ? { Authorization: "Bearer " + t, "Content-Type": "application/json" }
      : { "Content-Type": "application/json" };
  };
  window.requireAuth = function () {
    if (!window.getToken()) {
      window.location.href = "index.html?reason=login";
      return false;
    }
    return true;
  };
})();
