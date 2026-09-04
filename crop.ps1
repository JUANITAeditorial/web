Add-Type -AssemblyName System.Drawing

$srcPath = "C:\Users\Equipo\.gemini\antigravity\brain\1cb736d6-4aac-45da-8e8a-486cf4fa7f6b\.user_uploaded\media_1787782602479.jpg"
$outDir = "C:\Users\Equipo\.gemini\antigravity\scratch\juanita-editorial\assets"
$src = [System.Drawing.Bitmap]::FromFile($srcPath)

function Crop-Image($x, $y, $w, $h, $name) {
    $rect = New-Object System.Drawing.Rectangle($x, $y, $w, $h)
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.DrawImage($src, (New-Object System.Drawing.Rectangle(0, 0, $w, $h)), $rect, [System.Drawing.GraphicsUnit]::Pixel)
    $g.Dispose()
    $savePath = Join-Path $outDir "$name.png"
    $bmp.Save($savePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "Saved: $savePath"
}

# 1. Header Banner
Crop-Image 0 20 570 230 "banner-colorear"

# 2. Saints (Caras / Cuerpos)
Crop-Image 22 290 165 130 "saint-laura-montoya"
Crop-Image 230 280 115 130 "saint-carlo-acutis"
Crop-Image 395 320 130 115 "saint-teresita"
Crop-Image 50 575 130 125 "saint-padre-pio"
Crop-Image 215 575 135 125 "saint-juan-pablo-ii"
Crop-Image 380 575 135 125 "saint-martin-porres"

# 3. Books
Crop-Image 12 405 185 170 "book-laura-montoya"
Crop-Image 190 405 175 165 "book-carlo-acutis"
Crop-Image 360 410 185 175 "book-teresita"
Crop-Image 20 680 180 165 "book-padre-pio"
Crop-Image 195 685 175 160 "book-juan-pablo-ii"
Crop-Image 365 685 185 165 "book-martin-porres"

# 4. Combo Saint + Book (Pairs)
Crop-Image 12 285 185 290 "pair-laura-montoya"
Crop-Image 190 275 175 295 "pair-carlo-acutis"
Crop-Image 360 315 185 270 "pair-teresita"
Crop-Image 20 570 180 275 "pair-padre-pio"
Crop-Image 195 570 175 275 "pair-juan-pablo-ii"
Crop-Image 365 570 185 280 "pair-martin-porres"

$src.Dispose()
