# Permanent QR Code Generator

Generate QR codes that never expire. Free forever. Your URL is stored directly in the QR code itself - no database, no tracking, no expiration.

## How It Works

```
1. User enters URL
   ↓
2. URL gets compressed using LZ-String (50-70% reduction)
   ↓
3. Compressed URL becomes part of preview page path
   ↓
4. QR code contains: yourdomain.com/d/{compressed-url}
   ↓
5. User scans QR code → lands on preview page
   ↓
6. Preview page decompresses URL and redirects (100ms)
```

## Why This Is Different

**No Database** - The URL is embedded directly in the QR code. Nothing is stored on a server. The QR code IS the database.

**Never Expires** - Since there's no database entry to expire, your QR codes work forever.

**Maximum Privacy** - No tracking, no analytics, no user data collection.

**Smart Compression** - Uses LZ-String compression to make QR codes 50-70% smaller and easier to scan.

