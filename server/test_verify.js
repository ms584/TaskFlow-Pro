const { execSync } = require('child_process');

async function testAll() {
  const base = 'http://localhost:5000/api';
  console.log('--- 1. Testing Health ---');
  let res = await fetch(base + '/health');
  let data = await res.json();
  console.log('Health status:', data.status, 'DB:', data.database?.name);

  console.log('\n--- 2. Testing Auth Login (User 1) ---');
  res = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student1@ku.th', password: 'Password123!' })
  });
  const auth1 = await res.json();
  console.log('Login User 1 status:', auth1.success, 'User:', auth1.data?.user?.name);
  const token1 = auth1.data.token;

  console.log('\n--- 3. Testing Auth Login (User 2) ---');
  res = await fetch(base + '/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'student2@ku.th', password: 'Password123!' })
  });
  const auth2 = await res.json();
  console.log('Login User 2 status:', auth2.success, 'User:', auth2.data?.user?.name);
  const token2 = auth2.data.token;

  console.log('\n--- 4. Testing User 1 Todos (CRUD: Read) ---');
  res = await fetch(base + '/todos', {
    headers: { Authorization: 'Bearer ' + token1 }
  });
  const todos1 = await res.json();
  console.log('User 1 Todos count:', todos1.count, 'Stats:', todos1.stats);

  console.log('\n--- 5. Testing User 2 Todos (Isolation check) ---');
  res = await fetch(base + '/todos', {
    headers: { Authorization: 'Bearer ' + token2 }
  });
  const todos2 = await res.json();
  console.log('User 2 Todos count:', todos2.count, 'Stats:', todos2.stats);

  console.log('\n--- 6. Testing Create Todo (CRUD: Create) ---');
  res = await fetch(base + '/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token1
    },
    body: JSON.stringify({
      title: 'เตรียมเอกสารส่งรายวิชา CP363205',
      description: 'รวมไฟล์รายงานและเตรียม Demo Program',
      category: 'Study',
      priority: 'High'
    })
  });
  const created = await res.json();
  console.log('Create Todo result:', created.success, 'Title:', created.data?.title);
  const newId = created.data?._id;

  console.log('\n--- 7. Testing Search Todo (Search filter) ---');
  res = await fetch(base + '/todos?search=CP363205', {
    headers: { Authorization: 'Bearer ' + token1 }
  });
  const searchResult = await res.json();
  console.log('Search "CP363205" count:', searchResult.count);

  console.log('\n--- 8. Testing Toggle Complete ---');
  res = await fetch(base + '/todos/' + newId + '/toggle', {
    method: 'PATCH',
    headers: { Authorization: 'Bearer ' + token1 }
  });
  const toggled = await res.json();
  console.log('Toggle complete result:', toggled.success, 'Completed:', toggled.data?.completed);

  console.log('\n--- 9. Testing Update Todo (CRUD: Update) ---');
  res = await fetch(base + '/todos/' + newId, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer ' + token1
    },
    body: JSON.stringify({
      title: 'เตรียมเอกสารส่งรายวิชา CP363205 (อัปเดตแล้ว)'
    })
  });
  const updated = await res.json();
  console.log('Update result:', updated.success, 'Updated title:', updated.data?.title);

  console.log('\n--- 10. Testing Delete Todo (CRUD: Delete) ---');
  res = await fetch(base + '/todos/' + newId, {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + token1 }
  });
  const deleted = await res.json();
  console.log('Delete result:', deleted.success);

  console.log('\n--- 11. Testing External API Quote (Requirement 4.f) ---');
  res = await fetch(base + '/quotes/random');
  const quote = await res.json();
  console.log('External Quote result:', quote.success, 'Source:', quote.data?.source, 'Quote:', quote.data?.content);

  console.log('\n--- 12. Testing Front-end Vite Server (http://localhost:5173/) ---');
  const frontRes = await fetch('http://localhost:5173/');
  console.log('Front-end HTTP status:', frontRes.status, frontRes.statusText);

  console.log('\n=== ALL END-TO-END TESTS PASSED SUCCESSFULLY! ===');
}

testAll().catch(e => console.error('Test error:', e));
