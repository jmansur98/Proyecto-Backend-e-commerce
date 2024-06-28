document.addEventListener('DOMContentLoaded', () => {
    fetch('/api/users/admin', {
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
    .then(response => response.json())
    .then(users => {
        const tableBody = document.querySelector('#usersTable tbody');
        tableBody.innerHTML = ''; // Limpiar cualquier contenido previo
        
        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.first_name} ${user.last_name}</td>
                <td>${user.email}</td>
                <td>
                    <select class="role-select" data-user-id="${user._id}">
                        <option value="usuario" ${user.role === 'usuario' ? 'selected' : ''}>Usuario</option>
                        <option value="premium" ${user.role === 'premium' ? 'selected' : ''}>Premium</option>
                    </select>
                </td>
                <td>
                    <button type="button" class="save-role-btn" data-user-id="${user._id}">Guardar</button>
                </td>
                <td>
                    <form action="/api/users/${user._id}" method="POST" onsubmit="return confirm('¿Estás seguro de eliminar este usuario?');">
                        <input type="hidden" name="_method" value="DELETE">
                        <button type="submit">Eliminar</button>
                    </form>
                </td>
            `;
            tableBody.appendChild(row);
        });

        javascriptCopydocument.addEventListener('DOMContentLoaded', () => {
            // ... (código anterior sin cambios)
        
            document.querySelectorAll('.save-role-btn').forEach(button => {
                button.addEventListener('click', async (event) => {
                    event.preventDefault();
                    const userId = event.target.dataset.userId;
                    const selectElement = document.querySelector(`select[data-user-id="${userId}"]`);
                    const newRole = selectElement.value;
        
                    try {
                        const response = await fetch(`/api/users/${userId}/role`, {
                            method: 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${localStorage.getItem('token')}`
                            },
                            body: JSON.stringify({ role: newRole })
                        });
        
                        const contentType = response.headers.get("content-type");
                        if (contentType && contentType.indexOf("application/json") !== -1) {
                            const data = await response.json();
                            if (response.ok) {
                                alert(data.message);
                            } else {
                                throw new Error(data.error || 'Error al actualizar el rol');
                            }
                        } else {
                            // Si no es JSON, leemos como texto
                            const text = await response.text();
                            console.error('Respuesta no JSON:', text);
                            throw new Error('La respuesta del servidor no es JSON válido');
                        }
                    } catch (error) {
                        console.error('Error:', error);
                        alert(error.message);
                    }
                });
            })
        });
    });
    })