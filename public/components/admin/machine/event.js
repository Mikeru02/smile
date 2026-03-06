export default async function Events() {
    const baseUrl = `http://${import.meta.env.VITE_SRC_HOST}:${import.meta.env.VITE_SRC_PORT}`

    const machineInformation = await axios.get(
        `${baseUrl}/api/v1/admin/machine-info`,
        {
            headers: {
                "Content-Type": "application/json",
                "apikey": import.meta.env.VITE_SRC_KEY
            }
        }
    );
    const machineData = machineInformation.data.data;
    console.log("MACHINE DATA: ", machineData);
    // Populate CPU Information
    document.getElementById('processor-model').textContent = machineData.cpu.model || 'Unknown';
    document.getElementById('number-of-cores').textContent = machineData.cpu.cores || 'Unknown';
    document.getElementById('cpu-speed').textContent = machineData.cpu.speed ? `${machineData.cpu.speed} MHz` : 'Unknown';
    
    // Populate Memory Information
    document.getElementById('total-ram').textContent = `${machineData.memory.total_mb} MB`;
    document.getElementById('available-ram').textContent = `${machineData.memory.available_mb} MB`;
    document.getElementById('used-ram').textContent = `${machineData.memory.used_mb} MB`;
    
    // Populate Storage Information
    document.getElementById('total-storage').textContent = `${machineData.storage.total_mb} MB`;
    document.getElementById('used-storage').textContent = `${machineData.storage.used_mb} MB`;
    document.getElementById('available-storage').textContent = `${machineData.storage.available_mb} MB`;
    
    // Populate Network Information
    const primaryInterface = machineData.network.interfaces && machineData.network.interfaces[0];
    document.getElementById('ip-address').textContent = primaryInterface ? primaryInterface.ipv4 : 'N/A';
    document.getElementById('network-interface').textContent = primaryInterface ? primaryInterface.name : 'N/A';
    document.getElementById('gateway').textContent = machineData.network.gateway || 'N/A';
    document.getElementById('dns-servers').textContent = machineData.network.dns_servers && machineData.network.dns_servers.length > 0 
        ? machineData.network.dns_servers.join(', ') 
        : 'N/A';
    
    // Populate System Information
    document.getElementById('os-name').textContent = machineData.system_info.os_name || 'Unknown';
    document.getElementById('kernel-version').textContent = machineData.system_info.kernel || 'Unknown';
    document.getElementById('system-uptime').textContent = machineData.system_info.uptime || 'Unknown';
    document.getElementById('architecture').textContent = machineData.system_info.architecture || 'Unknown';
}