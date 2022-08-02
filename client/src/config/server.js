let SERVER;
if (process.env.REACT_APP_ENV === "local") {
   SERVER = "http://localhost:3000";
} else {
   SERVER = "https://dashboard.highfi.me";
}
export default SERVER