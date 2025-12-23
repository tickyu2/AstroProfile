# Deleting Windows Reserved Filenames (nul, con, prn, aux, etc.)

## The Problem

Windows has reserved device names that cannot be used as regular filenames:
- `nul` - Null device (discards all data)
- `con` - Console
- `prn` - Printer
- `aux` - Auxiliary device
- `com1` - `com9` - Serial ports
- `lpt1` - `lpt9` - Parallel ports

If a file with one of these names gets created (often by Linux tools, git, or cross-platform operations), Windows Explorer and standard commands cannot delete it because Windows interprets the name as a device reference.

## Symptoms

- File appears in Explorer but cannot be deleted
- `del filename` says "Access denied" or does nothing
- File shows as 0 KB
- PowerShell `Get-Item` says "Cannot find path" even though file is visible

## Solution

### Method 1: PowerShell Script (Recommended)

Create and run this PowerShell script:

```powershell
# Save as delete_reserved.ps1
$filename = "nul"  # Change to: con, prn, aux, etc.
$folder = "C:\astroprofile"  # Change to your folder

$path = "\\?\$folder\$filename"

try {
    [System.IO.File]::Delete($path)
    Write-Host "SUCCESS: $filename deleted"
} catch {
    Write-Host "FAILED: $_"
}
```

Run it:
```
powershell -ExecutionPolicy Bypass -File delete_reserved.ps1
```

### Method 2: Command Line (One-liner)

From PowerShell:
```powershell
[System.IO.File]::Delete("\\?\C:\astroprofile\nul")
```

From CMD:
```cmd
del "\\?\C:\astroprofile\nul"
```

**Note:** The `\\?\` prefix tells Windows to pass the path directly to the file system, bypassing the reserved name check.

### Method 3: Using Python

```python
import ctypes
from ctypes import wintypes

kernel32 = ctypes.WinDLL('kernel32', use_last_error=True)
path = r"\\?\C:\astroprofile\nul"
result = kernel32.DeleteFileW(path)

if result:
    print("Deleted successfully")
else:
    print(f"Failed, error: {ctypes.get_last_error()}")
```

## Verification

After deletion, verify with Python (most reliable):

```python
import os
files = [f for f in os.listdir(r'C:\astroprofile') if f.lower() == 'nul']
print('Found:', files if files else 'NONE - Successfully deleted!')
```

## Prevention

To prevent these files from being created:
1. Configure `.gitignore` to exclude reserved names
2. Be cautious when extracting archives from Linux/Mac systems
3. Use Git's `core.protectNTFS` setting: `git config --global core.protectNTFS true`

## Why Standard Methods Fail

| Method | Why It Fails |
|--------|--------------|
| Explorer Delete | Windows redirects to `\\.\nul` device |
| `del nul` | Same device redirection |
| `Remove-Item` | PowerShell uses standard Windows APIs |
| `rm` (Git Bash) | Passes through to Windows APIs |

The `\\?\` prefix is the key - it forces Windows to treat the path as a literal file path, not a device reference.

---
*Created: December 2025*
*Last used successfully: December 22, 2025*
