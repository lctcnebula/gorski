# WordPress media archive

Downloaded from the authenticated WordPress media library. Account credentials are not stored here.

- `source-inventory.json`: all 67 library records, including 64 images and 3 videos.
- `manifest.json`: download results, local paths, file sizes, and SHA-256 checksums.
- `../public/media/wordpress/`: media files, preserving WordPress year/month paths.
- `download.py`: repeatable downloader for this inventory. It does not modify WordPress.

The two original-resolution images retained by WordPress are included alongside their scaled versions. Generated thumbnail sizes are not duplicated; the source images are retained for local resizing.

Existing page assets remain in `public/images` and `public/video`. Their source references are local. YouTube, Jotform, Google Maps, and Elfsight remain external services.
