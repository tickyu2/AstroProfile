# Delete Windows reserved 'nul' file from astroprofile
# Run this script when the nul file appears

$nulPath = "\\?\C:\astroprofile\nul"

if (Test-Path -LiteralPath $nulPath) {
    try {
        Remove-Item -LiteralPath $nulPath -Force
        Write-Host "Successfully deleted nul file" -ForegroundColor Green
    } catch {
        Write-Host "Error deleting nul file: $_" -ForegroundColor Red
    }
} else {
    Write-Host "nul file not found (already deleted or doesn't exist)" -ForegroundColor Yellow
}
