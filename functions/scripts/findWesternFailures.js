const admin = require('firebase-admin');
const path = require('path');
const serviceAccountPath = path.resolve(__dirname, '../../astroprofile-391e6-e3277f82db70.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function findProblems() {
  const snapshot = await db.collection('profiles').get();
  const problems = [];

  snapshot.docs.forEach(doc => {
    const data = doc.data();
    const hasBazi = !!(data.bazi && data.bazi.elements);
    const hasWestern = !!(data.western && data.western.sun);

    if (hasBazi && !hasWestern) {
      problems.push({
        id: doc.id,
        name: data.displayName,
        birthDate: data.birthDate,
        birthTime: data.birthTime || 'MISSING',
        timezone: (data.timezone && data.timezone.zoneName) || data.timezone || 'MISSING',
        lat: (data.location && data.location.coordinates && data.location.coordinates.lat) || data.latitude || 0,
        lng: (data.location && data.location.coordinates && data.location.coordinates.lng) || data.longitude || 0,
        issue: 'BaZi OK, Western FAILED'
      });
    } else if (!hasBazi && hasWestern) {
      problems.push({
        id: doc.id,
        name: data.displayName,
        birthDate: data.birthDate,
        birthTime: data.birthTime || 'MISSING',
        issue: 'Western OK, BaZi FAILED'
      });
    } else if (!hasBazi && !hasWestern && data.migratedAt) {
      problems.push({
        id: doc.id,
        name: data.displayName,
        birthDate: data.birthDate,
        birthTime: data.birthTime || 'MISSING',
        issue: 'BOTH FAILED (after migration)'
      });
    }
  });

  console.log('=== PROFILES WITH CALCULATION ISSUES ===');
  console.log('Total profiles:', snapshot.size);
  console.log('Profiles with issues:', problems.length);
  console.log('');

  // Group by issue type
  const byIssue = {};
  problems.forEach(p => {
    if (!byIssue[p.issue]) byIssue[p.issue] = [];
    byIssue[p.issue].push(p);
  });

  Object.entries(byIssue).forEach(([issue, profiles]) => {
    console.log(`\n=== ${issue} (${profiles.length}) ===`);
    profiles.forEach(p => {
      console.log(`  ${p.name}`);
      console.log(`    Date: ${p.birthDate}, Time: ${p.birthTime}`);
      if (p.timezone) console.log(`    TZ: ${p.timezone}, Lat: ${p.lat}, Lng: ${p.lng}`);
    });
  });

  process.exit(0);
}
findProblems();
