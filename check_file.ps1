# PowerShell script to check the file directly
# Run with: powershell -File check_file.ps1

Write-Host "=" -NoNewline; Write-Host ("=" * 69)
Write-Host "🔍 CHECKING ACTUAL FILE CONTENT"
Write-Host "=" -NoNewline; Write-Host ("=" * 69)

$filePath = "src\utils\fourPillarsCalculator.js"

if (Test-Path $filePath) {
    Write-Host "`n✅ File exists: $filePath"
    
    $content = Get-Content $filePath -Raw
    
    # Extract the HOUR_STEM_TABLE
    if ($content -match "const HOUR_STEM_TABLE = \{([^}]+)\}") {
        Write-Host "`n📋 FOUND HOUR_STEM_TABLE"
        
        # Extract row 2
        if ($content -match "2:\s*\[([^\]]+)\]") {
            $row2 = $Matches[1]
            Write-Host "`n🎯 ROW 2 CONTENT:"
            Write-Host "2: [$row2]"
            
            # Check if it has the correct values
            if ($row2 -match "4,\s*5,\s*6,\s*7,\s*8,\s*9,\s*0,\s*1,\s*2,\s*3,\s*4,\s*5") {
                Write-Host "`n✅ ROW 2 IS CORRECT!"
                Write-Host "File has been updated properly."
                Write-Host "`nBUT tests still fail? Then it's a cache issue!"
                Write-Host "`n🔧 TRY:"
                Write-Host "1. Close ALL terminals"
                Write-Host "2. Run: npm run build"
                Write-Host "3. Test again"
            } else {
                Write-Host "`n❌ ROW 2 IS WRONG!"
                Write-Host "File was NOT updated correctly."
                Write-Host "`n🔧 MANUALLY EDIT THE FILE:"
                Write-Host "Open: $filePath"
                Write-Host "Find: line ~106"
                Write-Host "Change row 2 to:"
                Write-Host "  2: [4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5],"
            }
        }
    } else {
        Write-Host "`n❌ Could not find HOUR_STEM_TABLE in file!"
        Write-Host "Wrong file or file is corrupted!"
    }
    
} else {
    Write-Host "`n❌ FILE NOT FOUND: $filePath"
    Write-Host "Are you in the right directory?"
    Write-Host "Current directory: $(Get-Location)"
}

Write-Host "`n" -NoNewline
Write-Host "=" -NoNewline; Write-Host ("=" * 69)
