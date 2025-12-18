# Firebase Composite Index Setup for Advanced Search

## Required Index

To enable fast search with filters, create this composite index in Firebase:

### Collection: `resources`

**Fields (in exact order):**
1. `regulation` (Ascending)
2. `year` (Ascending)  
3. `semester` (Ascending)
4. `subjectCode` (Ascending)
5. `unit` (Ascending)
6. `documentType` (Ascending)
7. `uploadedAt` (Descending)

## How to Create the Index

### Option 1: Automatic (Recommended)
1. Run the search page (`/search`)
2. Apply any filter combination
3. Firebase will show an error with a link to create the index
4. Click the link and Firebase will auto-generate the index
5. Wait 2-3 minutes for indexing to complete

### Option 2: Manual Creation
1. Go to [Firebase Console](https://console.firebase.google.com/project/college-db-b20cc/firestore/indexes)
2. Click "Add Index" (Composite tab)
3. Collection ID: `resources`
4. Add fields in order:
   - `regulation` → Ascending
   - `year` → Ascending
   - `semester` → Ascending
   - `subjectCode` → Ascending
   - `unit` → Ascending
   - `documentType` → Ascending
   - `uploadedAt` → Descending
5. Click "Create Index"
6. Wait for "Building" → "Enabled" status

## Index Status
Check index status at:
```
https://console.firebase.google.com/project/college-db-b20cc/firestore/indexes
```

## Performance Notes
- Index enables < 500ms search results
- Supports all filter combinations
- Handles 1000+ documents efficiently
- Automatic index selection by Firebase

## Testing
After index creation:
1. Go to `/search`
2. Try various filter combinations
3. Results should load instantly
4. No "index required" errors

✅ Index is ready when status shows "Enabled" in Firebase Console
