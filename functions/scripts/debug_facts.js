const admin = require('firebase-admin');
const path = require('path');
const serviceAccountPath = path.resolve(__dirname, '../../astroprofile-391e6-e3277f82db70.json');
const serviceAccount = require(serviceAccountPath);
admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
const db = admin.firestore();

async function check() {
  const uid = 'nWL6aZIHCVdujSBT11B4HAjvLqj2';

  // Check brain1_learned_biography (what frontend reads)
  const path1 = `users/${uid}/brain1_learned_biography/historical_ronald_reagan`;
  const doc1 = await db.doc(path1).get();
  console.log('=== brain1_learned_biography ===');
  console.log('Path:', path1);
  console.log('Exists:', doc1.exists);
  if (doc1.exists) {
    const data = doc1.data();
    console.log('Facts count:', data.learned_facts?.length || 0);
    if (data.learned_facts) {
      data.learned_facts.forEach((f, i) => {
        console.log(`  ${i+1}. ${(f.fact || 'NO FACT FIELD').substring(0, 60)}...`);
      });
    }
  }

  // Check old wrong path
  const path2 = 'profiles/ticky_uthenpong/b1b_learned/historical_ronald_reagan';
  const doc2 = await db.doc(path2).get();
  console.log('\n=== OLD PATH (profiles/...) ===');
  console.log('Path:', path2);
  console.log('Exists:', doc2.exists);
  if (doc2.exists) {
    console.log('Facts count:', doc2.data().learned_facts?.length || 0);
  }

  process.exit(0);
}
check();
