# Read API Key from .env.local
$envContent = Get-Content ".env.local" -Raw
if ($envContent -match 'GEMINI_API_KEY=(.+)') {
    $apiKey = $matches[1].Trim().Trim('"').Trim("'")
    Write-Host "API Key found: $($apiKey.Substring(0,8))...$($apiKey.Substring($apiKey.Length-4))"
} else {
    Write-Host "ERROR: No API key found"
    exit 1
}

# Test models list
Write-Host "`n=== Listing Available Models ===`n"
$url = "https://generativelanguage.googleapis.com/v1beta/models?key=$apiKey"

try {
    $response = Invoke-RestMethod -Uri $url -Method Get
    $models = $response.models | Where-Object { 
        $_.supportedGenerationMethods -contains "generateContent" -and 
        ($_.name -like "*flash*" -or $_.name -like "*pro*")
    }
    
    Write-Host "Found $($models.Count) usable models:"
    $models | ForEach-Object {
        $modelName = $_.name -replace "models/", ""
        Write-Host "  - $modelName"
    }
    
    # Save first working model
    if ($models.Count -gt 0) {
        $workingModel = $models[0].name -replace "models/", ""
        $workingModel | Out-File "scripts\working-model.txt" -NoNewline
        Write-Host "`n✓ Selected model: $workingModel"
        Write-Host "Saved to: scripts\working-model.txt"
    }
} catch {
    Write-Host "ERROR: $_"
}
