<?php
$host = "localhost";
$dbname = "licenta";
$user = "postgres";
$pass = "1234";
$port = "5432";

// Establish connection
$conn = pg_connect("host=$host port=$port dbname=$dbname user=$user password=$pass");

if (!$conn) {
    die("❌ Connection to database failed.");
}

// 📊 Query: contest titles + number of entries + average grade
$query = "
    SELECT 
        c.title AS contest_title,
        COUNT(e.id) AS entry_count,
        ROUND(AVG(e.grade)::numeric, 2) AS average_grade
    FROM contest_entries e
    JOIN contests c ON e.contest_id = c.id
    GROUP BY c.title
    ORDER BY c.title;
";

$result = pg_query($conn, $query);

$labels = [];
$entryCounts = [];
$avgGrades = [];

while ($row = pg_fetch_assoc($result)) {
    $labels[] = $row['contest_title'];
    $entryCounts[] = (int) $row['entry_count'];
    $avgGrades[] = $row['average_grade'] ? (float) $row['average_grade'] : null;
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Contest Participation Statistics</title>
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
      background-color: #e8f5e9;
      font-family: 'Segoe UI', sans-serif;
      padding-bottom: 50px;
    }

    h1 {
      text-align: center;
      margin-top: 2rem;
      color: #2e7d32;
    }

    .chart-container {
      max-width: 950px;
      margin: 2rem auto;
      background: white;
      padding: 2rem;
      border-radius: 12px;
      box-shadow: 0 0 10px rgba(0,0,0,0.08);
    }

    .export-btn {
      margin-top: 1.5rem;
    }
  </style>
</head>
<body>

<h1>🏆 Contest Participation & Grades</h1>

<div class="chart-container">
  <canvas id="entryChart"></canvas>
  <div class="text-center">
    <button class="btn btn-success export-btn" onclick="downloadChart('entryChart', 'entries_chart.png')">📥 Download Entries Chart</button>
  </div>
</div>

<div class="chart-container">
  <canvas id="gradeChart"></canvas>
  <div class="text-center">
    <button class="btn btn-primary export-btn" onclick="downloadChart('gradeChart', 'grades_chart.png')">📥 Download Grades Chart</button>
  </div>
</div>

<script>
const labels = <?= json_encode($labels) ?>;
const entryData = <?= json_encode($entryCounts) ?>;
const gradeData = <?= json_encode($avgGrades) ?>;

// Chart 1: Entries
new Chart(document.getElementById("entryChart"), {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Number of Submissions',
      data: entryData,
      backgroundColor: 'rgba(76, 175, 80, 0.7)',
      borderColor: 'rgba(56, 142, 60, 1)',
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: '📥 Entries per Contest',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: { beginAtZero: true }
    }
  }
});

// Chart 2: Average Grades
new Chart(document.getElementById("gradeChart"), {
  type: 'bar',
  data: {
    labels: labels,
    datasets: [{
      label: 'Average Grade',
      data: gradeData,
      backgroundColor: 'rgba(33, 150, 243, 0.7)',
      borderColor: 'rgba(25, 118, 210, 1)',
      borderWidth: 1
    }]
  },
  options: {
    plugins: {
      title: {
        display: true,
        text: '📊 Average Grades per Contest',
        font: {
          size: 18
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 10
      }
    }
  }
});

// 📤 Export chart
function downloadChart(chartId, filename) {
    const canvas = document.getElementById(chartId);
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    link.click();
}
</script>

</body>
</html>
