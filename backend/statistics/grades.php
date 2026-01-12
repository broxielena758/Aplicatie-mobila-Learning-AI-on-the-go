<?php
include 'db.php';

if (isset($_GET['ajax']) && $_GET['ajax'] === 'true') {
    $query = "SELECT course_id, ROUND(AVG(grade), 2) AS avg_grade FROM submissions WHERE type = 'assignment' GROUP BY course_id";
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
<html>
<head>
<<<<<<< HEAD
=======
    <link rel="icon" type="image/png" href="images/logo.png">
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
    <meta charset="UTF-8">
    <title>Homework Grades</title>
    <!-- 📂 Statistics Navigation Menu -->
<div style="text-align: center; margin: 20px;">
    <a href="index.php" style="margin: 5px; padding: 10px 20px; background-color: #48c774; color: white; text-decoration: none; border-radius: 5px;">📊 Statistics Menu</a>
    <a href="grades.php" style="margin: 5px; padding: 10px 20px; background-color: #209cee; color: white; text-decoration: none; border-radius: 5px;">📘 Grades</a>
    <a href="feedback.php" style="margin: 5px; padding: 10px 20px; background-color: #ff851b; color: white; text-decoration: none; border-radius: 5px;">💬 Feedback</a>
    <a href="contests.php" style="margin: 5px; padding: 10px 20px; background-color: #b86bff; color: white; text-decoration: none; border-radius: 5px;">🏆 Contests</a>
    <a href="../src/index.html" style="margin: 5px; padding: 10px 20px; background-color: #363636; color: white; text-decoration: none; border-radius: 5px;">🏠 Go Home</a>
</div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <style>
        body {
<<<<<<< HEAD
            background-color: #eaf6ea;
            font-family: 'Segoe UI', sans-serif;
=======
            background: linear-gradient(135deg, #E8E2F0, #F0EAFA);
            font-family: 'Segoe UI', sans-serif;
            min-height: 100vh;
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
        }

        .container {
            max-width: 900px;
            margin-top: 3rem;
        }

        h2 {
<<<<<<< HEAD
            color: #2e7d32;
            margin-bottom: 2rem;
        }

        .btn-export {
            background-color: #43a047;
            color: white;
            border: none;
        }

        .btn-export:hover {
            background-color: #388e3c;
=======
            color: #6B46C1;
            margin-bottom: 2rem;
            text-shadow: 0 2px 4px rgba(107, 70, 193, 0.1);
        }

        .btn-export {
            background: linear-gradient(45deg, #A092D3, #8B7EC8);
            color: white;
            border: none;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(160, 146, 211, 0.3);
        }

        .btn-export:hover {
            background: linear-gradient(45deg, #8B7EC8, #7A6FBD);
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(160, 146, 211, 0.4);
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
        }

        canvas {
            background-color: #ffffff;
<<<<<<< HEAD
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
=======
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(107, 70, 193, 0.1);
            border: 1px solid rgba(160, 146, 211, 0.2);
        }

        .chart-container {
            background: rgba(255, 255, 255, 0.9);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(107, 70, 193, 0.15);
            border: 1px solid rgba(160, 146, 211, 0.2);
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
        }
    </style>
</head>
<body>
<div class="container text-center">
    <h2>📊 Real-Time Homework Grades</h2>
<<<<<<< HEAD
    <canvas id="gradesChart" width="600" height="300"></canvas>
    <div class="mt-4">
        <button class="btn btn-export" onclick="downloadChart()">📥 Download as PNG</button>
=======
    <div class="chart-container">
        <canvas id="gradesChart" width="600" height="300"></canvas>
        <div class="mt-4">
            <button class="btn btn-export" onclick="downloadChart()">📥 Download as PNG</button>
        </div>
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
    </div>
</div>

<script>
    const ctx = document.getElementById('gradesChart').getContext('2d');

    let chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: [],
            datasets: [{
                label: 'Average Grade',
                data: [],
<<<<<<< HEAD
                backgroundColor: 'rgba(76, 175, 80, 0.6)',
                borderColor: 'rgba(56, 142, 60, 1)',
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
            scales: {
<<<<<<< HEAD
                y: { beginAtZero: true, max: 10 }
            },
            plugins: {
                legend: { labels: { color: '#2e7d32' } },
                title: {
                    display: true,
                    text: 'Homework Grades by Course',
                    color: '#2e7d32',
                    font: { size: 18 }
=======
                y: { 
                    beginAtZero: true, 
                    max: 10,
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
            },
            plugins: {
                legend: { 
                    labels: { color: '#6B46C1' } 
                },
                title: {
                    display: true,
                    text: 'Homework Grades by Course',
                    color: '#6B46C1',
                    font: { size: 18, weight: 'bold' }
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
                }
            }
        }
    });

    async function fetchDataAndUpdate() {
        const response = await fetch('grades.php?ajax=true');
        const data = await response.json();

        chart.data.labels = data.map(d => "Course " + d.course_id);
        chart.data.datasets[0].data = data.map(d => parseFloat(d.avg_grade));
        chart.update();
    }

    function downloadChart() {
        const link = document.createElement('a');
        link.href = chart.toBase64Image();
        link.download = 'homework_grades_chart.png';
        link.click();
    }

    fetchDataAndUpdate();
    setInterval(fetchDataAndUpdate, 5000);
</script>
</body>
<<<<<<< HEAD
</html>
=======
</html>
>>>>>>> 76d0e869e664b86db84a4082d64aa6437cf7f82a
