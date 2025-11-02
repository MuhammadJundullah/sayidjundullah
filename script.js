import http from "k6/http";
import { check, sleep } from "k6";

// 1. Konfigurasi Stages dan Threshold
export const options = {
  // Threshold: Batasan performa yang harus dipenuhi.
  // Cek: Waktu respon (p95) dari HTTP request harus kurang dari atau sama dengan 200ms.
  thresholds: {
    http_req_duration: ["p(95) <= 200"], // 95% request harus selesai dalam 200ms
    http_req_failed: ["rate<0.01"], // Tingkat kegagalan request harus kurang dari 1%
  },

  // Stages: Mendefinisikan tahapan skenario beban kerja
  stages: [
    // Tahap 1: Memuat beban (Ramp-up)
    // Durasi 10s, naik dari 0 ke 50 Virtual Users (VU)
    { duration: "10s", target: 50 },

    // Tahap 2: Beban penuh (Peak Load)
    // Durasi 50s, naik dari 50 ke 100 Virtual Users (VU)
    { duration: "50s", target: 100 },

    // Tahap 3: Menurunkan beban (Ramp-down)
    // Durasi 10s, turun dari 100 ke 0 Virtual Users (VU)
    { duration: "10s", target: 0 },
  ],
};

// 2. Fungsi Utama (Main Function)
// eslint-disable-next-line import/no-anonymous-default-export
export default function () {
  const url = "http://localhost:3000/api/work-experiences";

  // Lakukan HTTP GET request
  const res = http.get(url);

  // Cek (Assertion): Memastikan respon berhasil
  check(res, {
    "Status 200": (r) => r.status === 200, // Cek status HTTP
    "Body size > 0": (r) => r.body.length > 0, // Cek isi respon tidak kosong
  });

  // Jeda singkat antar request untuk simulasi perilaku pengguna yang lebih realistis
  sleep(1);
}
