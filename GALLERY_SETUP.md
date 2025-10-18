# Gallery Setup Guide

## Dynamic Gallery Loading System

The website now features an **automatic gallery loading system** that dynamically discovers and displays images from service gallery folders. You no longer need to manually update code to add or modify gallery images!

## How It Works

Simply place your images in the appropriate folder under `public/gallery/`, and they will automatically appear on the corresponding service page.

### Directory Structure

```
public/
└── gallery/
    ├── truss_setup_manufacturing/    ← Truss Setup Manufacturing service
    ├── fabrication_works/            ← Fabrication Works service
    ├── grill_and_shutter/            ← Grill and Shutter service
    ├── dewanjee_pravesh_dwar/        ← Dewanjee Pravesh Dwar service
    ├── roofing/                      ← Roofing service (create when needed)
    ├── furniture/                    ← Furniture service (create when needed)
    ├── kitchen/                      ← Kitchen service (create when needed)
    └── shedding/                     ← Shedding service (create when needed)
```

## Adding Gallery Images

### Step 1: Choose the Right Folder

Find the folder name that matches your service:

| Service Name | Folder Name |
|-------------|-------------|
| Truss Setup Manufacturing | `truss_setup_manufacturing` |
| Fabrication Works | `fabrication_works` |
| Grill and Shutter | `grill_and_shutter` |
| Dewanjee Pravesh Dwar | `dewanjee_pravesh_dwar` |
| Dewanjee Steel Roofing Solutions | `roofing` |
| Dewanjee Furniture | `furniture` |
| Kitchen and Interior Makeover | `kitchen` |
| Shedding Works | `shedding` |

### Step 2: Add Your Images

1. **Navigate** to `public/gallery/[folder-name]/`
2. **Copy** your images into this folder
3. **That's it!** The images will automatically appear on the website

### Supported Formats

- `.jpg` / `.jpeg`
- `.png`
- `.webp`
- `.gif`

### File Naming

- **Filenames don't matter** - use any names you like
- For best results, use **numbered filenames** (e.g., `image_1.jpg`, `image_2.jpg`) to control the display order
- Images are automatically sorted numerically if numbers are found in the filename

### Examples

✅ **Good examples:**
```
gallery_grill_1.jpeg
gallery_grill_2.jpeg
photo_001.png
IMG_5432.jpg
```

✅ **Also works:**
```
my-awesome-gate.png
project-final-v2.jpg
whatever-you-want.jpeg
```

## Image Order

Images are displayed in **numerical order** based on numbers found in the filename. If no numbers are found, they're sorted alphabetically.

**Example:**
```
image_1.jpg      → Shows first
image_2.jpg      → Shows second
image_10.jpg     → Shows third
```

## Creating New Gallery Folders

To add a gallery for a service that doesn't have one yet:

1. **Create folder** in `public/gallery/` with the exact name from the table above
2. **Add images** to the new folder
3. **Rebuild** the site: `npm run build`
4. **Done!** Your gallery will appear automatically

## Troubleshooting

### Images not showing up?

1. **Check folder name** - Make sure it matches exactly (case-sensitive)
2. **Check file extension** - Only `.jpg`, `.jpeg`, `.png`, `.webp`, `.gif` are supported
3. **Rebuild the site** - Run `npm run build` to regenerate the static pages
4. **Check the console** - Build warnings will tell you if a gallery folder is missing

### Want to change the display order?

Rename your files with numbers:
```bash
# Before
awesome-gate.jpg
beautiful-grill.jpg

# After (controls order)
1-awesome-gate.jpg
2-beautiful-grill.jpg
```

## Benefits

✅ **No code changes needed** - Just add/remove image files  
✅ **Any filename works** - No naming conventions required  
✅ **Any supported format** - Mix and match JPG, PNG, WebP, etc.  
✅ **Easy maintenance** - Update galleries without touching code  
✅ **Automatic sorting** - Images display in numerical/alphabetical order  
✅ **Flexible** - Add as many or as few images as you want

## Need Help?

If you encounter issues or need to customize the gallery system, check:
- `app/utils/gallery-loader.ts` - Gallery loading logic
- `app/data/services.ts` - Service definitions
- `app/components/GalleryMasonry.tsx` - Gallery display component

