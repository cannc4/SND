import axios from 'axios'
axios.defaults.timeout = 50000
axios.defaults.baseURL = 'http://localhost:3030'
// axios.defaults.baseURL = 'http://skr-api.herokuapp.com/'
export default axios
