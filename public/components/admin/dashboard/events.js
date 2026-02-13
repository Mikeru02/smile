import axios from 'axios';

export default async function Events(){
    const dashboardInfo = await axios.get(
        '/api/v1/admin/dashboard-info',
        {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_SRC_KEY
            }
        }
    );
    console.log(dashboardInfo.data.data);
}