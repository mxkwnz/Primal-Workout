var API_URL = window.API_URL;
var token = window.getToken();

async function fetchUsers() {
  const res = await fetch(`${API_URL}/mod/users`, {
    headers: { Authorization: `Bearer ${token}` }
  })
  if (!res.ok) {
    alert('Not authorized')
    return
  }
  const users = await res.json()
  renderUsers(users)
}

function renderUsers(users) {
  const tbody = document.querySelector('#users-table tbody')
  tbody.innerHTML = ''
  users.forEach(u => {
    const tr = document.createElement('tr')
    tr.innerHTML = `
      <td>${u.username}</td>
      <td>${u.email}</td>
      <td>${u.role}</td>
      <td>
        <select data-id="${u._id}" class="role-select">
          <option value="user"${u.role==='user'?' selected':''}>user</option>
          <option value="premium"${u.role==='premium'?' selected':''}>premium</option>
        </select>
        <button data-id="${u._id}" class="save-role">Save</button>
        <button data-id="${u._id}" class="delete-user" style="background:#666">Delete</button>
      </td>
    `
    tbody.appendChild(tr)
  })
}

document.addEventListener('click', async (e) => {
  if (e.target.classList.contains('save-role')) {
    const id = e.target.getAttribute('data-id')
    const sel = document.querySelector(`select.role-select[data-id="${id}"]`)
    const role = sel.value
    const res = await fetch(`${API_URL}/mod/users/${id}/role`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ role })
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || 'Failed to update role')
    } else {
      alert('Role updated')
      fetchUsers()
    }
  }
  if (e.target.classList.contains('delete-user')) {
    const id = e.target.getAttribute('data-id')
    if (!confirm('Delete this user?')) return
    const res = await fetch(`${API_URL}/mod/users/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    if (!res.ok) {
      alert(data.message || 'Failed to delete')
    } else {
      fetchUsers()
    }
  }
})

document.addEventListener('DOMContentLoaded', () => {
  if (!token) {
    alert('Login as moderator first')
    window.location.href = 'index.html'
    return
  }
  fetchUsers()
})
