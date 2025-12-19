
-- 1. Kullanıcı İstatistikleri
-- Kullanıcının tamamladığı görev sayısı, toplam puanı
SELECT 
  u.name,
  COUNT(ts.id) as completed_tasks,
  SUM(t.points) as total_points
FROM "User" u
JOIN "TaskSubmission" ts ON u.id = ts."userId"
JOIN "Task" t ON ts."taskId" = t.id
GROUP BY u.id, u.name
ORDER BY total_points DESC;

-- 2. Zamanında Teslim Oranı (On-Time Rate)
-- Due date olan ve tamamlanan görevler üzerinden hesaplanır
SELECT 
  u.name,
  COUNT(CASE WHEN ts."createdAt" <= t."dueAt" THEN 1 END) * 100.0 / COUNT(ts.id) as on_time_percentage
FROM "User" u
JOIN "TaskSubmission" ts ON u.id = ts."userId"
JOIN "Task" t ON ts."taskId" = t.id
WHERE t."dueAt" IS NOT NULL
GROUP BY u.id, u.name;

-- 3. Proje Bazlı İlerleme
-- Tamamlanan / Toplam Görev
SELECT 
  p.name as project_name,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) as completed_tasks,
  (COUNT(CASE WHEN t.status = 'COMPLETED' THEN 1 END) * 100.0 / NULLIF(COUNT(t.id), 0)) as progress_percentage
FROM "Project" p
JOIN "ProjectBranch" pb ON p.id = pb."projectId"
LEFT JOIN "Task" t ON pb.id = t."branchId"
GROUP BY p.id, p.name;

-- 4. Dallara Göre Görev Dağılımı ve Tıkanıklık
-- Hangi dalda daha çok 'AVAILABLE' veya 'TAKEN' (bitmemiş) görev var?
SELECT 
  p.name as project_name,
  pb.name as branch_name,
  COUNT(t.id) as total_tasks,
  COUNT(CASE WHEN t.status = 'AVAILABLE' THEN 1 END) as pending_tasks,
  COUNT(CASE WHEN t.status = 'TAKEN' THEN 1 END) as in_progress_tasks
FROM "ProjectBranch" pb
JOIN "Project" p ON pb."projectId" = p.id
LEFT JOIN "Task" t ON pb.id = t."branchId"
GROUP BY p.id, p.name, pb.id, pb.name
ORDER BY pending_tasks DESC;

-- 5. Expired Görevleri Bulma (Cron mantığının SQL hali)
SELECT * FROM "Task"
WHERE status = 'TAKEN' 
  AND "dueAt" < NOW();
