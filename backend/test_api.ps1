# PowerShell script để test API endpoints trên Windows
# Usage: .\test_api.ps1

$BASE_URL = "http://localhost:8000"

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "SEQUENTIAL MINING API TEST SUITE" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host ""

# Test 1: Health Check
Write-Host "TEST 1: Health Check" -ForegroundColor Yellow
Write-Host "GET $BASE_URL/"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 2: Get Available Topics
Write-Host "TEST 2: Get Available Topics" -ForegroundColor Yellow
Write-Host "GET $BASE_URL/topics/"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/topics/" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 3: Get Recommendations - Machine Learning
Write-Host "TEST 3: Get Recommendations - Machine Learning" -ForegroundColor Yellow
Write-Host "POST $BASE_URL/recommend/"
try {
    $body = @{
        target_topic = "Machine Learning"
        max_steps = $null
        courses_per_step = 3
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/recommend/" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 4: Get Recommendations - React JS
Write-Host "TEST 4: Get Recommendations - React JS" -ForegroundColor Yellow
Write-Host "POST $BASE_URL/recommend/"
try {
    $body = @{
        target_topic = "React JS"
        max_steps = $null
        courses_per_step = 2
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/recommend/" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 5: Get Recommendations - Limited Steps
Write-Host "TEST 5: Get Recommendations - Machine Learning (3 steps max)" -ForegroundColor Yellow
Write-Host "POST $BASE_URL/recommend/"
try {
    $body = @{
        target_topic = "Machine Learning"
        max_steps = 3
        courses_per_step = 2
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/recommend/" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 6: Search Courses - Python
Write-Host "TEST 6: Search Courses - Python" -ForegroundColor Yellow
Write-Host "GET $BASE_URL/search/?keyword=Python&limit=5"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/search/?keyword=Python&limit=5" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 7: Invalid Topic
Write-Host "TEST 7: Invalid Topic - Blockchain" -ForegroundColor Yellow
Write-Host "POST $BASE_URL/recommend/"
try {
    $body = @{
        target_topic = "Blockchain"
        max_steps = $null
        courses_per_step = 3
    } | ConvertTo-Json
    
    $response = Invoke-RestMethod -Uri "$BASE_URL/recommend/" -Method Post -Body $body -ContentType "application/json"
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

# Test 8: Search Courses - No results
Write-Host "TEST 8: Search Courses - XYZ123 (should return no results)" -ForegroundColor Yellow
Write-Host "GET $BASE_URL/search/?keyword=XYZ123&limit=5"
try {
    $response = Invoke-RestMethod -Uri "$BASE_URL/search/?keyword=XYZ123&limit=5" -Method Get
    $response | ConvertTo-Json -Depth 10
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "ALL API TESTS COMPLETED" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan

