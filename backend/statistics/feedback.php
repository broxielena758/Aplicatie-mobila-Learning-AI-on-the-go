<?php
// feedback.php (fixed version)
include 'db.php';

if (isset($_GET['ajax']) && $_GET['ajax'] === 'true') {
    // ✅ Corrected query: use submissions table, filtered by type 'project'
    $query = "SELECT course_id, COUNT(*) AS feedback_count FROM submissions WHERE type = 'project' GROUP BY course_id";
    $result = pg_query($conn, $query);

    $data = [];
    while ($row = pg_fetch_assoc($result)) {
        $data[] = $row;
    }
    echo json_encode($data);
    exit;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
<<<<<<< HEAD
=======
    <link rel="icon" type="image/png" href="images/logo.png">
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
    <meta charset="UTF-8">
    <title>📩 Real-Time Project Feedback</title>
    <!-- 📂 Statistics Navigation Menu -->
<div style="text-align: center; margin: 20px;">
    <a href="index.php" style="margin: 5px; padding: 10px 20px; background-color: #48c774; color: white; text-decoration: none; border-radius: 5px;">📊 Statistics Menu</a>
    <a href="grades.php" style="margin: 5px; padding: 10px 20px; background-color: #209cee; color: white; text-decoration: none; border-radius: 5px;">📘 Grades</a>
    <a href="feedback.php" style="margin: 5px; padding: 10px 20px; background-color: #ff851b; color: white; text-decoration: none; border-radius: 5px;">💬 Feedback</a>
    <a href="contests.php" style="margin: 5px; padding: 10px 20px; background-color: #b86bff; color: white; text-decoration: none; border-radius: 5px;">🏆 Contests</a>
    <a href="../src/index.html" style="margin: 5px; padding: 10px 20px; background-color: #363636; color: white; text-decoration: none; border-radius: 5px;">🏠 Go Home</a>
</div>

    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body {
<<<<<<< HEAD
            background-color: #e8f5e9;
            font-family: 'Segoe UI', sans-serif;
        }
        h2 {
            text-align: center;
            color: #2e7d32;
            margin-top: 2rem;
        }
        .chart-container {
            max-width: 900px;
            margin: 3rem auto;
            background: white;
            padding: 2rem;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .btn-download {
            display: block;
            margin: 1rem auto 2rem auto;
=======
            background: linear-gradient(135deg, #E8E2F0, #F0EAFA);
            font-family: 'Segoe UI', sans-serif;
            min-height: 100vh;
        }
        
        h2 {
            text-align: center;
            color: #6B46C1;
            margin-top: 2rem;
            text-shadow: 0 2px 4px rgba(107, 70, 193, 0.1);
        }
        
        .chart-container {
            max-width: 900px;
            margin: 3rem auto;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 2rem;
            border-radius: 16px;
            box-shadow: 0 8px 32px rgba(107, 70, 193, 0.15);
            border: 1px solid rgba(160, 146, 211, 0.2);
        }
        
        .btn-download {
            display: block;
            margin: 1rem auto 2rem auto;
            background: linear-gradient(45deg, #A092D3, #8B7EC8);
            border: none;
            color: white;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(160, 146, 211, 0.3);
        }
        
        .btn-download:hover {
            background: linear-gradient(45deg, #8B7EC8, #7A6FBD);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(160, 146, 211, 0.4);
            color: white;
        }

        canvas {
            border-radius: 12px;
            box-shadow: 0 4px 16px rgba(107, 70, 193, 0.1);
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
        }
    </style>
</head>
<body>

<h2>📩 Real-Time Project Feedback</h2>
<div class="chart-container">
    <canvas id="feedbackChart"></canvas>
<<<<<<< HEAD
    <button id="downloadBtn" class="btn btn-warning btn-download">📥 Download as PNG</button>
=======
    <button id="downloadBtn" class="btn btn-download">📥 Download as PNG</button>
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
</div>

<script>
const ctx = document.getElementById('feedbackChart').getContext('2d');

let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            label: 'Feedback Count',
            data: [],
<<<<<<< HEAD
            backgroundColor: 'rgba(255, 152, 0, 0.6)',  // 🟧 New warm orange color
            borderColor: 'rgba(255, 152, 0, 1)',
            borderWidth: 1
=======
            backgroundColor: 'rgba(160, 146, 211, 0.7)',
            borderColor: 'rgba(107, 70, 193, 1)',
            borderWidth: 2,
            borderRadius: 8,
            borderSkipped: false,
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
        }]
    },
    options: {
        plugins: {
            title: {
                display: true,
                text: 'Feedback Entries per Course',
                font: {
<<<<<<< HEAD
                    size: 18
=======
                    size: 18,
                    weight: 'bold'
                },
                color: '#6B46C1'
            },
            legend: {
                labels: {
                    color: '#6B46C1'
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
                }
            }
        },
        scales: {
<<<<<<< HEAD
            y: { beginAtZero: true }
=======
            y: { 
                beginAtZero: true,
                grid: {
                    color: 'rgba(160, 146, 211, 0.1)'
                },
                ticks: {
                    color: '#6B46C1'
                }
            },
            x: {
                grid: {
                    color: 'rgba(160, 146, 211, 0.1)'
                },
                ticks: {
                    color: '#6B46C1'
                }
            }
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
        }
    }
});

async function fetchDataAndUpdate() {
    const response = await fetch('feedback.php?ajax=true');
    const data = await response.json();

    chart.data.labels = data.map(d => "Course " + d.course_id);
    chart.data.datasets[0].data = data.map(d => parseInt(d.feedback_count));
    chart.update();
}

// Initial + interval refresh
fetchDataAndUpdate();
setInterval(fetchDataAndUpdate, 5000);

// PNG download
document.getElementById('downloadBtn').addEventListener('click', () => {
    const link = document.createElement('a');
    link.download = 'feedback_chart.png';
    link.href = chart.toBase64Image();
    link.click();
});
</script>

</body>
<<<<<<< HEAD
</html>
=======
</html>
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
