# PowerShell script to add React import to all JSX files
# Run this in your AstroProfile folder

$files = Get-ChildItem -Path "src" -Filter "*.jsx" -Recurse

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    
    # Check if React is already imported
    if ($content -notmatch "import\s+React\s+from\s+['\`"]react['\`"]") {
        # Check if file has any imports (to add React at the top)
        if ($content -match "^import") {
            # Add React import as the first line
            $newContent = "import React from 'react'`n" + $content
            Set-Content -Path $file.FullName -Value $newContent -NoNewline
            Write-Host "Added React import to: $($file.FullName)"
        }
    } else {
        Write-Host "React already imported in: $($file.FullName)"
    }
}

Write-Host "`nDone! React import added to all necessary files."
